import subprocess
import os

dir_path = os.path.dirname(os.path.realpath(__file__)) #holds the directory where python script is located
os.chdir(dir_path)
os.chdir("../flask-server")
subprocess.check_call('python -m flask run', shell=True)