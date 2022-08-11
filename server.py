from flask import Flask, render_template, jsonify, request, redirect
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import auth
from firebase_admin.auth import UserRecord
import firebasescrypt
import json


app = Flask(__name__)

#Firebase Setup
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cost-mates-default-rtdb.firebaseio.com'
})

#Reference to the database
ref = db.reference('/') 
userId = '1'

@app.route('/')
def landpage():
    return render_template("landpage.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg=""
    if request.method == 'POST':
        email = request.form['emailLogin'].lower()
        password = request.form['passwordLogin']
        is_valid = validate_password(email, password)
        if is_valid:    
            return redirect("/index")
        else:
            msg = "Incorrect email or password."
            return render_template("login.html", error=msg)
    return render_template("login.html")

@app.route('/register', methods=['GET', 'POST'])
def register():
    global userId
    if request.method == 'POST':
        displayName = request.form['displayName']
        email = request.form['emailRegister'].lower()
        password = request.form['passwordRegister']
        passwordCheck = request.form['passwordCheck']
        print("Name: " + displayName + "\nEmail: " + email + "\nPassword: " + password + "\npasswordCheck: " + passwordCheck)
           
        if (displayName and email and password and passwordCheck):
            if password == passwordCheck:
                new_user: UserRecord = create_user(userId, displayName, email, password)
                userId = str(int(userId) + 1)
                return redirect('/login')
    return render_template("register.html")

@app.route('/index')
def index():
    return render_template("index.html")

def create_user(userId: str, displayName: str, email: str, password: str) -> UserRecord:
    return auth.create_user(uid=userId, display_name=displayName, email=email, password=password)


def validate_password(email, password):
    hash = open('hash-key.json')
    data = json.load(hash)
    for user in auth.list_users().iterate_all():
        if user.email == email:
            is_valid = firebasescrypt.verify_password(
                password=password,
                known_hash=user.password_hash,
                salt=user.password_salt,
                salt_separator=data['base64_salt_separator'],
                signer_key=data['base64_signer_key'],
                rounds=data['rounds'],
                mem_cost=data['mem_cost']
            )
            return is_valid


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)