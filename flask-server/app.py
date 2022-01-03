from flask import Flask
from flask import request
from psycopg2 import sql
from datetime import datetime

import json
import requests
import telegram
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


def sql_call(sql_string):
    conn = None
    conn = Connector.DBConnector()
    rows_effected, result_rows = conn.execute(sql_string)
    conn.commit()
    conn.close()
    return result_rows

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

@app.route("/")
def home():
    
    bot=telegram.Bot(token="5026396246:AAHVsBnqNR0xGLsalEFgRZMRyw2CZT1hKMo")
    chat=869421566
    telegram_hanlder.poll(bot, "#23 how are you?", ["good","very good"], [869421566], 23)
    return "Hello, Flask!"



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
        print(e.message)
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

@app.route("/add_poll", methods = ['POST'])
def add_poll():
    data = request.data
    poll = json.loads(data)
    time_now = datetime.now().strftime('%Y-%m-%d')
    sql_query_string = sql.SQL(f"INSERT INTO polls (question, created_at) VALUES ({poll.question}, '{time_now}')")
    result = sql_call(sql_query_string)
    _id = "1"
    for answer in poll['answers']:
        sql_query_string = sql.SQL(f"INSERT INTO polls_options (poll_id, option) VALUES ({_id}, '{answer.option}')")
        result = sql_call(sql_query_string)

    
    



   

if __name__ == '__main__':
    app.run(debug=False)

#TODO: filter by poll Id(?) + answer Id
#TODO: Autehntication