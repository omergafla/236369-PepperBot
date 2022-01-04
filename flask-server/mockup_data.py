import random
from psycopg2 import sql
from datetime import datetime
import utils.DBConnector as Connector


def sql_call(sql_string):
    conn = None
    conn = Connector.DBConnector()
    rows_effected, result_rows = conn.execute(sql_string)
    conn.commit()
    conn.close()
    return result_rows

def add_users():
    usernames = ['Noah', 'Leon', 'Paul', 'Matteo', 'Ben', 'Elias', 'Finn', 'Felix', 'Henry', 'Louis']
    for i in range(len(usernames)):
        effective_id = i+26543123
        username = usernames[i]
        timenow = datetime.now().strftime('%Y-%m-%d')
        sql_string = "INSERT INTO public.users(effective_id, username, created_at) VALUES ({effective_id}, '{username}', '{timenow}')".format(effective_id=effective_id, username=username, timenow=timenow)
        result = sql_call(sql_string)


def add_users_answers():
    ids = [1,10]
    usernames = ['Noah', 'Leon', 'Paul', 'Matteo', 'Ben', 'Elias', 'Finn', 'Felix', 'Henry', 'Louis']
    for i in range(len(usernames)):
        ids.append(i+26543123)
    options = [{"poll_id": 25, "possible_answers": [18,19,20,21,22]},
               {"poll_id": 26, "possible_answers": [23,24]},
               {"poll_id": 27, "possible_answers": [25,26]},
               {"poll_id": 28, "possible_answers": [27,28,29,30]}]
    for user_id in ids:
        for poll in options:
            option_id = random.choice(poll["possible_answers"])
            sql_string = "INSERT INTO public.users_answers(user_id, poll_id, option_id) VALUES ({user_id}, {poll_id}, {option_id})".format(user_id=user_id, poll_id=poll["poll_id"], option_id=option_id)
            result = sql_call(sql_string)


    

    
