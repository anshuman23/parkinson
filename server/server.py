
from flask import Flask,render_template,send_from_directory,request
app = Flask(__name__, template_folder=".././frontend")
from flask_cors import CORS
import base64





app.config['SECRET_KEY'] = 'mysecret'
app.config["CACHE_TYPE"] = "null"
BASE_PATH = '.././frontend'



CORS(app)
@app.route('/css/<path:path>')
def send_css(path):
   return send_from_directory(BASE_PATH + '/css/', path)


CORS(app)
@app.route('/js/<path:path>')
def send_js(path):
   return send_from_directory(BASE_PATH + '/js/', path)



@app.route("/")
def index():
   return render_template("index.html")

if __name__ == '__main__': 
   print('hello')
   app.run(host='0.0.0.0', debug = True, port = 9787,ssl_context='adhoc') 
