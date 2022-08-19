from datetime import timedelta
import email
from turtle import pos, update
from flask import Flask, render_template, jsonify, request, redirect, session, Response
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import auth
from firebase_admin.auth import UserRecord
import firebasescrypt
import json
from uuid6 import uuid6
import uuid

app = Flask(__name__)
app.secret_key = 'yumcha'
app.permanent_session_lifetime = timedelta(days=60)

#Firebase Setup
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cost-mates-default-rtdb.firebaseio.com'
})

@app.route('/')
def landpage():
    return render_template("landpage.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg=""
    if request.method == 'POST':
        session.permanent = True
        email = request.form['emailLogin'].lower()
        password = request.form['passwordLogin']
        is_valid = validate_password(email, password)
        if is_valid:
            session['email'] = request.form['emailLogin'].lower()
            return redirect("/index")
        else:
            msg = "Incorrect email or password."
            return render_template("login.html", error=msg)
    else:
        if "email" in session:
            return redirect("/index")
        return render_template("login.html")

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        displayName = request.form['displayName']
        email = request.form['emailRegister'].lower()
        password = request.form['passwordRegister']
        passwordCheck = request.form['passwordCheck']
        print("Name: " + displayName + "\nEmail: " + email + "\nPassword: " + password + "\npasswordCheck: " + passwordCheck)
        if (displayName and email and password and passwordCheck):
            if password == passwordCheck:
                userId = str(uuid6())
                new_user: UserRecord = create_user(userId, displayName, email, password)
                createUserDatabase(email, userId)
                return redirect('/login')
    return render_template("register.html")

@app.route('/index')
def index():
    if "email" in session:
        return render_template("index.html")
    else:
        return redirect("/login")

@app.route('/contact')
def contact_us():
    return render_template("contact_us.html")

@app.route('/logout')
def logout():
    session.pop("email", None)
    return redirect("/login")

@app.route('/api/post', methods=['POST'])
def createSplitDatabase():
    summary = {}
    uid = str(uuid.uuid4())
    updateUserSplitId(uid)
    splitRef = db.reference('/Splits/splitId_' + uid + "/Items")
    summaryRef = db.reference('/Splits/splitId_' + uid)
    for i in range(1, int(len(request.form) / 3) + 1):
        itemName = request.form[str(i) + "[items]"]
        itemCost = request.form[str(i) + "[costs]"]
        mates = request.form[str(i) + "[mates]"]
        mates = mates.split(',')
        
        for mate in mates:
            mate = mate.strip()
            split_cost = float(itemCost) / len(mates)
            split_cost = round(split_cost, 2)
            if mate in summary:
                summary[mate] += split_cost
            else:
                summary[mate] = 0
                summary[mate] += split_cost
    
        itemData = {
            itemName: {
                "Users": mates,
                "Total": float(itemCost)
            }
        }
        splitRef.push().set(itemData)
    summaryRef.push().set(summary)
    return Response(status=200)

@app.route('/api/updateHeaders', methods=['POST'])
def getUserTablePref():
    position = {}
    for i in range(0, int(len(request.form))):
        pos = request.form[str(i)]
        position[i] = pos
    updateUserHeaderPref(position)
    return Response(status=200)

@app.route('/api/splits', methods=['GET'])
def getUserSplit():
    userSplit = []
    ref = db.reference('/Users')
    getRef = ref.get()
    email = session['email']
    user = auth.get_user_by_email(email)
    uid = user.uid
    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == uid:
                userSplitsRef = db.reference('/Users/' + key + "/" + k + "/splits")
                for x in getUserSplitId(userSplitsRef):
                    splitRef = db.reference('/Splits/splitId_' + x)
                    splitData = splitRef.get()
                    for val in splitData.values():
                        resp = {
                            "splits": val,
                            "length": len(getUserSplitId(userSplitsRef))
                        }
                        userSplit.append(resp)
                return jsonify(userSplit)


def getUserSplitId(ref):
    splitData = []
    getSplit = ref.get()
    if getSplit != None:
        for sk, sv in getSplit.items():
            for val in sv.values():
                splitData.append(val)
    return splitData
    
            

def createUserDatabase(email, userId):
    user = auth.get_user_by_email(email)
    uid = userId
    userRef = db.reference('/Users')
    data = {
        uid: {
            "displayName": user.display_name,
            "email": user.email,
            "order": {
                0: ""
            }
        }
    }
    userRef.push().set(data)

def updateUserHeaderPref(position):
    ref = db.reference('/Users')
    getUser = ref.get()
    user = auth.get_user_by_email(session['email'])
    uid = user.uid
    for key, value in getUser.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == uid:
                dataRef.child(k).update({"order": position})

def updateUserSplitId(splitId):
    _uid = str(uuid.uuid4())
    ref = db.reference('/Users')
    getUser = ref.get()
    user = auth.get_user_by_email(session['email'])
    uid = user.uid
    for key, value in getUser.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == uid:
                dataRef.child(k).child("splits").push({_uid: splitId})

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