from flask import Flask
from flask import request
import json
from psycopg2 import sql
from datetime import datetime

import json
import requests
import telegram
from telegram import poll
import utils.DBConnector as Connector
from utils.ReturnValue import ReturnValue
from utils.Exceptions import DatabaseException
from telegram import Update, ForceReply, ParseMode, Poll
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, updater, CallbackQueryHandler
import requests
from telegram.inline.inlinekeyboardbutton import InlineKeyboardButton
from telegram.inline.inlinekeyboardmarkup import InlineKeyboardMarkup
import telegram_hanlder


app = Flask(__name__)

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
        response = app.response_class(response=json.dumps(result[0]),
                                  status=200,
                                  mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        print(str(e))
        response = app.response_class(status = 500)
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
        print(str(e))
        response = app.response_class(status = 500)
    finally:
        return response

@app.route("/admins_counts")
def get_admins():
    try:
        sql_string = """select COUNT(id) as total from users where is_admin = 1"""
        db_result = sql_call(sql_string)
        result = map_result(db_result)
        response = app.response_class(response=json.dumps(result[0]),
                                  status=200,
                                  mimetype='application/json')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as e:
        print(str(e))
        response = app.response_class(status = 500)
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
        print(str(e))
        response = app.response_class(status = 500)
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
        print(str(e))
        response = app.response_class(status = 500)
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
        print(str(e))
        return app.response_class(status = 500)
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
        print(str(e))
        return app.response_class(status = 500)
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
        print(str(e))
        return app.response_class(status = 500)
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
        print(str(e))
        return app.response_class(status = 500)
    finally:
        return response


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

if __name__ == '__main__':
    app.run(debug=False)

#TODO: filter by poll Id(?) + answer Id
#TODO: Autehntication