from datetime import timedelta
from getpass import getuser
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

@app.route('/logout')
def logout():
    session.pop("email", None)
    return redirect("/login")

# API Calls
@app.route('/api/post', methods=['POST'])
def createSplitDatabase():
    user = auth.get_user_by_email(session['email'])
    summary = {}
    sharedMates = {}
    uid = str(uuid.uuid4())
    updateUserSplitId(uid, session['email'])
    summaryRef = db.reference('/Splits/splitId_' + uid + "/Mates")
    sharedMatesRef = db.reference('/Splits/splitId_' + uid + "/SharedMates")
    splitNameRef = db.reference('/Splits/splitId_' + uid + "/SplitName")
    dateCreatedRef = db.reference('/Splits/splitId_' + uid + "/DateCreated")
    for i in range(1, int(len(request.form) / 6) + 1):
        itemName = request.form[str(i) + "[items]"]
        itemCost = request.form[str(i) + "[costs]"]
        mates = request.form[str(i) + "[mates]"]
        mateList = request.form[str(i) + "[mateList]"]

        mates = mates.split(',')
        mateList = mateList.split(',')

        for m in mateList:
            m = m.strip()
            if m not in sharedMates:
                sharedMates[m] = True
        
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
            "Users": mates,
            "Total": float(itemCost)
        }

        itemRef = db.reference('/Splits/splitId_' + uid + "/Items/" + itemName)
        itemRef.push().set(itemData)
    splitNameRef.push().set(request.form[str(1) + "[splitName]"])
    dateCreatedRef.push().set(request.form[str(1) + "[date]"])
    summaryRef.push().set(summary)
    sharedMatesRef.push().set(sharedMates)
    return jsonify({'status': 200,
    'splitId': uid})

    
@app.route('/api/updateData', methods=['POST'])
def updateSplitDatabase():
    user = auth.get_user_by_email(session['email'])
    summary = {}
    sharedMates = {}
    uid =  request.form['sid']
    sumLength = request.form['sumLen']
    db.reference('/Splits/splitId_' + uid).delete()
    summaryRef = db.reference('/Splits/splitId_' + uid + "/Mates")
    sharedMatesRef = db.reference('/Splits/splitId_' + uid + "/SharedMates")
    splitNameRef = db.reference('/Splits/splitId_' + uid + "/SplitName")
    dateCreatedRef = db.reference('/Splits/splitId_' + uid + "/DateCreated")

    for i in range(1, int(sumLength) + 1):
        itemName = request.form["sum[" + str(i) + "]" + "[items]"]
        itemCost = request.form["sum[" + str(i) + "]" + "[costs]"]
        mates = request.form["sum[" + str(i) + "]" + "[mates]"]
        mates = mates.split(',')

        mateList = request.form["sum[" + str(i) + "]" + "[mateList]"]
        mateList = mateList.split(',')
        mateList.append(user.display_name)
        for m in mateList:
            m = m.strip()
            if m not in sharedMates:
                sharedMates[m] = True
        
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
            "Users": mates,
            "Total": float(itemCost)
        }
        itemRef = db.reference('/Splits/splitId_' + uid + "/Items/" + itemName)
        itemRef.push().set(itemData)
    splitNameRef.push().set(request.form["sum[" + str(i) + "]" + "[splitName]"])
    dateCreatedRef.push().set(request.form["sum[" + str(i) + "]" + "[date]"])

    summaryRef.push().set(summary)
    sharedMatesRef.push().set(sharedMates)
    return jsonify({'status': 200,
    'splitId': request.form})


@app.route('/api/splits', methods=['GET'])
def getUserSplit():
    userSplit = {}
    splitList = []
    refIdList = []
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
                    refIdList.append(x)
                    for val in splitData.values():
                        resp = {
                            "data": val
                        }
                        splitList.append(resp)
                userSplit = {
                    "split": splitList,
                    "length": len(getUserSplitId(userSplitsRef)),
                    "referenceId": refIdList
                }
                return jsonify(userSplit)

@app.route('/api/getLoggedUser', methods=['GET'])
def getCurrentLoggedUser():
     getUser = auth.get_user_by_email(session['email'])
     user = {
        "user": getUser.display_name,
        "email": getUser.email,
        'success': 200
     }
     return jsonify(user)


@app.route('/api/checkUserExist', methods=['GET'])
def checkUserExist():
    email = request.args.get('email')
    data = {}

    try:
        getUser = auth.get_user_by_email(email)
        data = {
            "name": getUser.display_name
        }
    except:
        data = {
            "name": ""
        }
    return jsonify(data)

@app.route('/api/shareSplits', methods=['POST'])
def shareSplits():
    add = True
    getSessionUser = auth.get_user_by_email(session['email'])
    uid = getSessionUser.uid
    sharedSplit = {}
    ref = db.reference('/Users')
    getRef = ref.get()
    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == uid:
                userSplitsRef = db.reference('/Users/' + key + "/" + k + "/splits")
                getSplit = userSplitsRef.get()
                if getSplit != None:
                    for sk, sv in getSplit.items():
                        sharedSplit = sv
    for i in range(0, int(len(request.form))):
        email = request.form[str(i) + "[email]"]
        getUser = auth.get_user_by_email(email)
        getUid = getUser.uid
        for key, value in getRef.items():
            dRef = db.reference('/Users/' + key)
            getData = dRef.get()
            for k, v in getData.items():
                if k == getUid:
                    userSplitsRef = db.reference('/Users/' + key + "/" + k + "/splits")
                    getSplit = userSplitsRef.get()
                    if getSplit != None:
                        for sk, sv in getSplit.items():
                            for x in list(sharedSplit.values()):
                                if x in list(sv.values()):
                                    add = False
                        if add:
                            userSplitsRef.push().set(sharedSplit)
                    else:
                        userSplitsRef.push().set(sharedSplit)
            add = True
    return jsonify({'status': 200})

@app.route('/api/summary', methods=['GET'])
def createSummary():
    getUser = auth.get_user_by_email(session['email'])
    userRef = db.reference('/Users')
    getRef = userRef.get()
    result = {}
    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == getUser.uid:
                userSplitsRef = db.reference('/Users/' + key + "/" + k + "/splits")
                getSplit = userSplitsRef.get()
                for val in getSplit.values():
                    for v in val.values():
                        splitRef = db.reference('/Splits/' + "splitId_" + v + '/Mates')
                        getSplit = splitRef.get()
                        for summary in getSplit.values():
                            result = summary
    return jsonify({"summary": result})

@app.route('/api/viewSplit', methods=['GET'])
def getRows():
    splitId = request.args.get('splitId')
    splitRef = db.reference('/Splits/' +'splitId_' + splitId).get()
    summaryRows=[]
    return jsonify(splitRef)

@app.route('/api/postArchive', methods=['POST'])
def archiveSystem():
    splitId = request.form['splitId']
    getUser = auth.get_user_by_email(session['email'])
    userRef = db.reference('/Users')
    getRef = userRef.get()

    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == getUser.uid:
                userSplitRef = db.reference('/Users/' + key + "/" + k + "/splits")
                userSplit = userSplitRef.get()
                for sk, sv in userSplit.items():
                    for val in sv.values():
                        if val == splitId:
                            archiveRef = db.reference('/Users/' + key + "/" + k + "/archive")
                            archiveRef.push().set({
                                "splitId": splitId
                            })
                            userSplitRef.child(sk).set({})
    return jsonify({'success': 200})


@app.route('/api/getArchiveData', methods=['GET'])
def getSplitDataById():
    splitList = []
    resp = {}
    
    getUser = auth.get_user_by_email(session['email'])
    userRef = db.reference('/Users')
    getRef = userRef.get()
    
    onloadList = []
    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == getUser.uid:
                archiveRef = db.reference('/Users/' + key + "/" + k + "/archive")
                archiveData = archiveRef.get()
                if(archiveData != None):
                    for val in archiveData.values():
                        splitRef = db.reference('/Splits/splitId_' + val['splitId'])
                        splitData = splitRef.get()
                        for v in splitData.values():
                            resp = {
                                "data": v
                            }
                            splitList.append(resp)
                            onloadArchive = {
                                "splitId": val['splitId']
                            }
                        onloadList.append(onloadArchive)
    return jsonify(splitList, onloadList)

@app.route('/api/unarchiveData',  methods=['POST'])
def unarchiveData():
    getId = request.form['splitId']
    getUser = auth.get_user_by_email(session['email'])
    userRef = db.reference('/Users')
    getRef = userRef.get()

    for key, value in getRef.items():
        dataRef = db.reference('/Users/' + key)
        getData = dataRef.get()
        for k, v in getData.items():
            if k == getUser.uid:
                archiveRef = db.reference('/Users/' + key + "/" + k + "/archive")
                userSplitRef = db.reference('/Users/' + key + "/" + k + "/splits")
                archiveData = archiveRef.get()
                userSplitRef.get()
                if archiveData != None:
                    for ak, av in archiveData.items():
                        for val in av.values():
                            if getId == val:
                                userSplitRef.push().set({
                                    "splitId": getId
                                })
                                archiveRef.child(ak).set({})

    return jsonify({'success': 200})

#Helper Functions
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


def updateUserSplitId(splitId, email):
    _uid = str(uuid.uuid4())
    ref = db.reference('/Users')
    getUser = ref.get()
    user = auth.get_user_by_email(email)
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