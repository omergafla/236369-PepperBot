import subprocess
import os

dir_path = os.path.dirname(os.path.realpath(__file__)) #holds the directory where python script is located
os.chdir(dir_path)
os.chdir("../my-app")
# subprocess.check_call('npm install', shell=True)
subprocess.check_call('npm start', shell=True)