from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
from flask_session import Session

import json
from psycopg2 import sql
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
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
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "tRWzJbjLnVWJezAU"
app.config["SECRET_KEY"] = "22222"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["SESSION_TYPE"] = 'null'
# app.config.from_object(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
Session(app)
jwt = JWTManager(app)
app.config.from_object(__name__)
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)


def map_result(obj):
    rows = obj.rows
    cols = obj.cols
    res = []
    for row in rows:
        add_row = {}
        for index in range(len(row)):
            key = obj.cols_header[index]
            add_row[key] = row[index]
        res.append(add_row)
    return res


def reduce_poll_data(poll):
    res = {}
    answers = []
    if len(poll) > 0:
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
    sql_string = "select effective_id from users where is_active = 1"
    users = map_result(sql_call(sql_string))
    ids = [user['effective_id'] for user in users]
    return ids


def get_option_id(poll_id, option):
    sql_string = "select id from polls_options where poll_id = {poll_id} and option = '{option}' limit 1".format(
        poll_id=poll_id, option=option)
    data = sql_call(sql_string)
    return data[0]["id"]


def get_users_for_sub_poll(permission):
    sql_string = "select distinct user_id from users_answers where option_id={permission}".format(
        permission=permission)
    users = map_result(sql_call(sql_string))
    ids = [user['user_id'] for user in users]
    return ids


def set_active_value(effective_id, active):
    try:
        sql_query_string = sql.SQL(
            f'select * from users where is_active=1 and effective_id={effective_id}')
        result = sql_call(sql_query_string)
        if len(result.rows) > 0 and active == 1:
            response = app.response_class(status=409)
        else:
            sql_query_string = sql.SQL(
                f'UPDATE users SET is_active={active} WHERE effective_id={effective_id}')
            result = sql_call(sql_query_string)
            response = app.response_class(status=200)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


def send_poll(poll_id, question, answers, users=None):
    bot = telegram.Bot(token="5026396246:AAHVsBnqNR0xGLsalEFgRZMRyw2CZT1hKMo")
    chats = []
    if(users is None):
        chats = get_active_users()
    else:
        chats = users
    telegram_hanlder.poll(bot, question, answers, chats, poll_id)


def hash_password(password):
    return generate_password_hash(password)


def verify_password(password, pwhash):
    return check_password_hash(pwhash, password)


@app.route("/add_user", methods=['POST'])
def insert_user():
    try:
        time_now = datetime.now()
        effective_id, username, created_at = request.form["effective_id"], request.form["username"], time_now.strftime(
            '%Y-%m-%d')
        sql_query_string = sql.SQL(
            f"INSERT INTO users (effective_id, username, created_at) VALUES ({effective_id}, '{username}', '{created_at}')")
        result = sql_call(sql_query_string)
        response = app.response_class(status=200)
    except DatabaseException.UNIQUE_VIOLATION as e:
        response = set_active_value(effective_id, 1)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/remove_user", methods=['POST'])
def delete_user():
    try:
        effective_id = request.form["effective_id"]
        response = set_active_value(effective_id, 0)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/users_counts_data")
def get_users():
    try:
        sql_string = """
        select COUNT(CASE WHEN is_active = 1 THEN id END) AS active,
        COUNT(CASE WHEN is_active = 0 THEN id END) AS inactive,
        COUNT(id) as total
        from users"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response

@app.route("/admins")
def get_admins():
    try:
        sql_string = """SELECT a.id, a.username, COALESCE(t.polls,0) as polls
                        FROM admins a
                        LEFT JOIN (select COALESCE(count(id),0) as polls , created_by
                        from polls
                        group by created_by)t
                        ON a.username = t.created_by"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        print(str(e))
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/polls")
def get_all_polls():
    try:
        sql_string = """select polls.id, question, created_by, created_at, answers 
                        from polls 
                        left join polls_popularity t on t.id = polls.id"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        for r in result:
            r["created_at"] = str(r["created_at"])
        result = {"result": result}
        response = app.response_class(response=json.dumps(result),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/polls_counts")
def get_polls():
    try:
        sql_string = """select COUNT(id) as total from polls"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/admins_counts")
def get_all_admins():
    try:
        sql_string = """select COUNT(*) as total from admins"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/today_polls")
def today_polls():
    try:
        sql_string = """select count(*) as total from polls where DATE(created_at) >= CURRENT_DATE"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/acctive_users_today")
def active_users_today():
    try:
        sql_string = """select count(distinct user_id) as total from users_answers where poll_id in (select id from polls where DATE(created_at) >= CURRENT_DATE)"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/newest_poll")
def get_newest_poll():
    try:
        sql_string = """select id, question from polls order by id desc limit 1"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        return app.response_class(status=500)
    finally:
        return response


@app.route("/most_popular_poll")
def get_popular_poll():
    try:
        sql_string = """select poll_id, question
         from (select count(poll_id) as total, poll_id from questions_and_answers group by poll_id order by total desc limit 1)t
        left join polls on t.poll_id = polls.id"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        return app.response_class(status=500)
    finally:
        return response


@app.route("/daily_users")
def daily_users():
    try:
        sql_string = """SELECT date, COUNT(DISTINCT id) AS new_users
                        FROM (VALUES
                            (CAST(CURRENT_DATE - 0 AS DATE)),
                            (CAST(CURRENT_DATE - 1 AS DATE)), -- build the list of dates
                            (CAST(CURRENT_DATE - 2 AS DATE)),
                            (CAST(CURRENT_DATE - 3 AS DATE)),
                            (CAST(CURRENT_DATE - 4 AS DATE)),
                            (CAST(CURRENT_DATE - 5 AS DATE)),
                            (CAST(CURRENT_DATE - 6 AS DATE))  
                        ) datelist(date)
                        LEFT JOIN users ON created_at = date
                        GROUP BY date
                        ORDER BY date ASC"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        for r in result:
            r["date"] = str(r["date"])
        response = app.response_class(response=json.dumps(result),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        return app.response_class(status=500)
    finally:
        return response


@app.route("/daily_polls")
def daily_polls():
    try:
        sql_string = """SELECT date, COUNT(DISTINCT id) AS new_polls
                        FROM (VALUES
                            (CAST(CURRENT_DATE - 0 AS DATE)),
                            (CAST(CURRENT_DATE - 1 AS DATE)), -- build the list of dates
                            (CAST(CURRENT_DATE - 2 AS DATE)),
                            (CAST(CURRENT_DATE - 3 AS DATE)),
                            (CAST(CURRENT_DATE - 4 AS DATE)),
                            (CAST(CURRENT_DATE - 5 AS DATE)),
                            (CAST(CURRENT_DATE - 6 AS DATE))  
                        ) datelist(date)
                        LEFT JOIN polls ON created_at = date
                        GROUP BY date
                        ORDER BY date ASC"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        for r in result:
            r["date"] = str(r["date"])
        response = app.response_class(response=json.dumps(result),
                                      status=200,
                                      mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        return app.response_class(status=500)
    finally:
        return response


@app.route("/add_poll", methods=['POST'])
def add_poll():
    try:
        response = app.response_class(status=200)
        data = request.data
        poll = json.loads(data)
        time_now = datetime.now().strftime('%Y-%m-%d')
        sql_string = "INSERT INTO polls (question, created_at) VALUES ('{question}', '{time_now}') RETURNING id".format(
            question=poll["question"], time_now=time_now)
        result = sql_call(sql_string)
        flatten_answers = []
        if result:
            _id = result[0]["id"]
            for answer in poll['answers']:
                flatten_answers.append(answer["option"])
                sql_string = "INSERT INTO polls_options (poll_id, option) VALUES ({id}, '{answer}')".format(
                    id=_id, answer=answer["option"])
                result = sql_call(sql_string)
            print("Added Poll: #" + str(_id))
            send_poll(_id, poll["question"], flatten_answers)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/add_admin", methods=['POST'])
def add_admin():
    try:
        response = app.response_class(status=200)
        data = json.loads(request.data)
        sql_string = "INSERT INTO Admins (username, password) VALUES ('{username}', '{password}')".format(
            username=data["username"], password=hash_password(data["password"]))
        result = sql_call(sql_string)
    except Exception as e:
        if e.message == 'UNIQUE_VIOLATION':
            response = app.response_class(status=409)
        else:
            response = app.response_class(status=500)
    finally:
        return response


@app.route("/add_sub_poll", methods=['POST'])
def add_sub_poll():
    try:
        response = app.response_class(status=200)
        data = request.data
        poll = json.loads(data)
        time_now = datetime.now().strftime('%Y-%m-%d')
        permission = get_option_id(poll["poll_id"], poll["answer"])
        sql_string = "INSERT INTO polls (question, permission, created_at) VALUES ('{question}', {permission}, '{time_now}') RETURNING id".format(
            question=poll["question"], permission=permission, time_now=time_now)
        result = sql_call(sql_string)
        flatten_answers = []
        if result:
            _id = result[0]["id"]
            for answer in poll['answers']:
                flatten_answers.append(answer["option"])
                sql_string = "INSERT INTO polls_options (poll_id, option) VALUES ({id}, '{answer}')".format(
                    id=_id, answer=answer["option"])
                result = sql_call(sql_string)
            print("Added Poll: #" + str(_id))
            users = get_users_for_sub_poll(permission)
            send_poll(_id, poll["question"], flatten_answers, users)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/poll/<poll_id>")
def get_poll(poll_id):
    try:
        response = app.response_class(status=200)
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
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/add_answer", methods=['POST'])
def add_answer():
    try:
        chat_id, poll_id, answer = request.form["chat_id"], request.form["poll_id"], request.form["answer"]
        option_id = get_option_id(poll_id, answer)
        sql_query_string = sql.SQL(
            f"INSERT INTO users_answers (user_id, poll_id, option_id) VALUES ({chat_id}, '{poll_id}', '{option_id}')")
        result = sql_call(sql_query_string)
        response = app.response_class(status=200)
    except Exception as e:
        response = app.response_class(status=500)
    finally:
        return response


@app.route("/username")
@cross_origin()
@jwt_required()
def getUsername():
    username = get_jwt()["sub"]
    response = jsonify({"username": username})
    return response


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
@cross_origin()
def create_token():
    try:
        username = json.loads(request.data)["username"]
        password = json.loads(request.data)["password"]
        if username is None or password is None:
            return app.response_class(status=400)
        sql_string = f"""select username, password from admins where username='{username}'"""
        result = sql_call(sql_string)
        if len(result.rows) != 1:  # admin doesnt exist
            return app.response_class(status=401)
        result_dict = map_result(result)[0]
        if (username == "admin"):
            correct_password = password == result_dict["password"]
        else:
            correct_password = verify_password(
                password, result_dict["password"])
        if correct_password == False:  # wrong password
            return app.response_class(status=401)
        access_token = create_access_token(identity=username)
        response = app.response_class(response=json.dumps({"access_token": access_token}),
                                      status=200,
                                      mimetype='application/json')
    except Exception as e:
        return app.response_class(status=500)
    return response


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/")
# @jwt_required()
@cross_origin()
def somefunc():
    response = app.response_class(status=200)
    return response


if __name__ == '__main__':
    app.run(debug=False)
