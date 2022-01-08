from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import json
from psycopg2 import sql
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json
import requests
import telegram
from telegram import poll
import utils.DBConnector as Connector
from utils.ReturnValue import ReturnValue
from utils.Exceptions import DatabaseException
from telegram import Update, ForceReply, ParseMode, Poll
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, updater, CallbackQueryHandler
from telegram.inline.inlinekeyboardbutton import InlineKeyboardButton
from telegram.inline.inlinekeyboardmarkup import InlineKeyboardMarkup
import telegram_hanlder
from passlib.apps import custom_app_context as pwd_context


app = Flask(__name__)
cors = CORS(app)
app.config["JWT_SECRET_KEY"] = "tRWzJbjLnVWJezAU"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

def map_result(obj):
    rows = obj.rows
    cols = obj.cols
    res = []
    for row in rows:
        add_row = {}
        for index in range(len(row)):
            key  = obj.cols_header[index]
            add_row[key] = row[index]
        res.append(add_row)
    return res

def reduce_poll_data(poll):
    res = {}
    answers = []
    res["id"] = poll[0]["poll_id"]
    res["question"] = poll[0]["question"]
    for data in poll:
        memo = {"answer": data["option"], "counts": data["counts"]}
        answers.append(memo)
    res["options"] = answers
    return res   

def sql_call(sql_string):
    conn = None
    conn = Connector.DBConnector()
    rows_effected, result_rows = conn.execute(sql_string)
    conn.commit()
    conn.close()
    return result_rows

def get_active_users():
    sql_string="select effective_id from users where is_active = 1"
    users = map_result(sql_call(sql_string))
    ids = [user['effective_id'] for user in users]
    return ids

def get_option_id(poll_id, option):
    sql_string="select id from polls_options where poll_id = {poll_id} and option = '{option}' limit 1".format(poll_id=poll_id, option=option)
    data = sql_call(sql_string)
    return data[0]["id"]

def set_active_value(effective_id, active):
    try:
        sql_query_string = sql.SQL(f'select * from users where is_active=1 and effective_id={effective_id}')
        result = sql_call(sql_query_string)
        if len(result.rows) > 0 and active == 1:
            response = app.response_class(status=409)
        else:      
            sql_query_string = sql.SQL(f'UPDATE users SET is_active={active} WHERE effective_id={effective_id}')
            result = sql_call(sql_query_string)
            response = app.response_class(status=200)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response

def send_poll(poll_id, question, answers, users=None):
    bot=telegram.Bot(token="5026396246:AAHVsBnqNR0xGLsalEFgRZMRyw2CZT1hKMo")
    chats = []
    if(users is None):
        chats = get_active_users()
    telegram_hanlder.poll(bot, question, answers, chats, poll_id)


@app.route("/add_user", methods = ['POST'])
def insert_user():
    try:
        time_now = datetime.now()
        effective_id, username, created_at = request.form["effective_id"], request.form["username"], time_now.strftime('%Y-%m-%d')
        sql_query_string = sql.SQL(f"INSERT INTO users (effective_id, username, created_at) VALUES ({effective_id}, '{username}', '{created_at}')")
        result = sql_call(sql_query_string)
        response = app.response_class(status = 200)
    except DatabaseException.UNIQUE_VIOLATION as e:
        response = set_active_value(effective_id, 1)
    except Exception as e:
        response = app.response_class(status = 500)
        print(str(e))
    finally:
        return response

@app.route("/remove_user", methods = ['POST'])
def delete_user():
    try:
        effective_id = request.form["effective_id"]
        response = set_active_value(effective_id, 0)
    except Exception as e:
        response = app.response_class(status = 500)
    finally:
        return response

@app.route("/users_counts_data")
def get_users():
    try:
        sql_string = """select COUNT(CASE WHEN is_active = 1 THEN id END) AS active,
         COUNT(CASE WHEN is_active = 0 THEN id END) AS inactive,
		 COUNT(CASE WHEN is_admin = 1 THEN id END) AS admins,
		 COUNT(id) as total
        from users"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        return app.response_class(response=json.dumps(result[0]),
                                  status=200,
                                  mimetype='application/json')
    except Exception as e:
        print(str(e))
        return app.response_class(status = 500)

@app.route("/newest_poll")
def get_newest_poll():
    try:
        sql_string = """select id, question from polls order by id desc limit 1"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        return app.response_class(response=json.dumps(result[0]),
                                  status=200,
                                  mimetype='application/json')
    except Exception as e:
        print(str(e))
        return app.response_class(status = 500)

@app.route("/add_poll", methods = ['POST'])
def add_poll():
    try:
        response = app.response_class(status = 200)
        data = request.data
        poll = json.loads(data)
        time_now = datetime.now().strftime('%Y-%m-%d')
        sql_string = "INSERT INTO polls (question, created_at) VALUES ('{question}', '{time_now}') RETURNING id".format(question = poll["question"], time_now=time_now)
        result = sql_call(sql_string)
        flatten_answers=[]
        if result:
            _id = result[0]["id"]
            for answer in poll['answers']:
                flatten_answers.append(answer["option"])
                sql_string = "INSERT INTO polls_options (poll_id, option) VALUES ({id}, '{answer}')".format(id=_id, answer=answer["option"])
                result = sql_call(sql_string)
            print("Added Poll: #" + str(_id))
            send_poll(_id, poll["question"], flatten_answers)
    except Exception as e:
        response = app.response_class(status = 500)
        print(str(e))
    finally:
        return response
    
@app.route("/poll/<poll_id>")
def get_poll(poll_id):
    try:
        response = app.response_class(status = 200)
        sql_string = """select poll_id, 
                        question,
                        option,
                        count(user_id) as counts
                        from questions_and_answers where poll_id={id}
                        group by question, option, poll_id
                        order by counts asc""".format(id=poll_id)
        result = reduce_poll_data(map_result(sql_call(sql_string)))
        response = app.response_class(response=json.dumps(result),
                                  status=200,
                                  mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status = 500)
        print(str(e))
    finally:
        return response
 
@app.route("/add_answer", methods = ['POST'])
def add_answer():
    try:
        chat_id, poll_id, answer = request.form["chat_id"], request.form["poll_id"], request.form["answer"]
        option_id = get_option_id(poll_id, answer)
        sql_query_string = sql.SQL(f"INSERT INTO users_answers (user_id, poll_id, option_id) VALUES ({chat_id}, '{poll_id}', '{option_id}')")
        result = sql_call(sql_query_string)
        response = app.response_class(status = 200)
    except Exception as e:
        response = app.response_class(status = 500)
        print(str(e))
    finally:
        return response

def hash_password(password):
        return pwd_context.encrypt(password)

def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)


####################################Authentication Routes###################################
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/token', methods=["POST"])
def create_token():
    username = json.loads(request.data)["username"]
    password = json.loads(request.data)["password"] 
    if username is None or password is None:
        abort(400) # missing arguments
    sql_string = f"""select username, password from admins where username='{username}'"""
    result = sql_call(sql_string)
    result_dict = map_result(result)[0]
    if len(result.rows) != 1: # admin doesnt exist
        return app.response_class(status=401)
    # correct_password = verify_password(password,result_dict["password"])
    correct_password = password == result_dict["password"] #change this once the passwords are hashed
    if correct_password == False: # wrong password
        return app.response_class(status=401)
    access_token = create_access_token(identity=username)
    response = app.response_class(response=json.dumps({"access_token":access_token}),
                                status=200,
                                mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route("/")
@jwt_required()
@cross_origin()
def somefunc():
    response = app.response_class(status=200)
    return response


if __name__ == '__main__':
    app.run(debug=False)

