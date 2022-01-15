from psycopg2 import sql
import utils.DBConnector as Connector
from utils.ReturnValue import ReturnValue
from utils.Exceptions import DatabaseException


def sql_call(sql_string):
    conn = None
    conn = Connector.DBConnector()
    rows_effected, result_rows = conn.execute(sql_string)
    conn.commit()
    conn.close()
    return result_rows


f = open("./init_db.sql", 'r')
script = f.read()
sql_query_string = sql.SQL(script)
result = sql_call(sql_query_string)

#We assume you have the database when you run this script! Please see init configuration in utils/database.ini