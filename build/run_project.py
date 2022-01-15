from subprocess import Popen, PIPE
import os

print("----------Running server...------------")
Popen(["python", "./build/run_server.py"])
print("----------Running DB...------------")
Popen(["python", "./build/run_db.py"])
print("----------Running Client...------------")
Popen(["python", "./build/run_client.py"])
print("----------Running Telegram Handler...------------")
Popen(["python", "./flask-server/telegram_hanlder.py"])