from flask import Flask, render_template
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

app = Flask(__name__)

#Firebase Setup
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cost-mates-default-rtdb.firebaseio.com'
})

#Reference to the database
ref = db.reference('/') 

@app.route('/')
def landpage():
    return render_template("landpage.html")

@app.route('/login.html')
def login():
    return render_template("login.html")

@app.route('/register.html')
def register():
    return render_template("register.html")

@app.route('/index.html')
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)