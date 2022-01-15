from subprocess import Popen, PIPE
import os


Popen(["python", "./build/run_server.py"])
Popen(["python", "./build/run_db.py"])
Popen(["python", "./build/run_client.py"])
Popen(["python", "./flask-server/telegram_hanlder.py"])