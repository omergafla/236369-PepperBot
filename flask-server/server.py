from flask import Flask
from flask import json
import utils.DBConnector as Connector
from utils.ReturnValue import ReturnValue
from utils.Exceptions import DatabaseException
from psycopg2 import sql


app = Flask(__name__)


def sql_call(sql_string):
    try:
        conn = None
        conn = Connector.DBConnector()
        rows_effected, result_rows = conn.execute(sql_string)
        conn.close()
        return result_rows
    except Exception as e:
        return e



@app.route("/users")
def get_users():
    try:
        sql_query_string = sql.SQL("SELECT * FROM users")
        result = sql_call(sql_query_string)
        response = app.response_class(
            response=json.dumps(result.rows),
            status=200,
            mimetype='application/json'
        )
    except Exception as e:
        response = f"Unexpected {e=}, {type(e)=}"
    finally:
        return response

if __name__ == "__main__":
    app.run(debug=False)