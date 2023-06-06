import os
import requests
from flask import Flask, request, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS

app = Flask(__name__)

# add db
db_uri = os.getenv("DB_URI")
# need to export it, .flaskenv doesn't work
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
db = SQLAlchemy(app)
ma = Marshmallow(app)

# configure app
# controls permanent session storage
app.config["SESSION_PERMANENT"] = False
# controls how session is stored (files on the server's file system in this case)
app.config["SESSION_TYPE"] = "filesystem"
# security measure, prevents JavaScript from accessing cookie
app.config["SESSION_COOKIE_HTTPONLY"] = True
# cors
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False

Session(app)
CORS(app, supports_credentials=True)


# database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    hash = db.Column(db.String(1000), unique=True)
    google_id = db.Column(db.String(1000))

    def __init__(self, username, hash, google_id):
        self.username = username
        self.hash = hash
        self.google_id = google_id


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "username", "hash", "google_id")


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class UserData(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    last_smoked = db.Column(db.DateTime, nullable=False)
    cig_daily = db.Column(db.Integer, nullable=False)
    pack_price = db.Column(db.Integer, nullable=False)
    cig_in_pack = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    currency_sign = db.Column(db.String(3), nullable=False)

    def __init__(
        self,
        user_id,
        last_smoked,
        cig_daily,
        pack_price,
        cig_in_pack,
        currency,
        currency_sign,
    ):
        self.user_id = user_id
        self.last_smoked = last_smoked
        self.cig_daily = cig_daily
        self.pack_price = pack_price
        self.cig_in_pack = cig_in_pack
        self.currency = currency
        self.currency_sign = currency_sign


class UserDataSchema(ma.Schema):
    class Meta:
        fields = (
            "user_id",
            "last_smoked",
            "cig_daily",
            "pack_price",
            "cig_in_pack",
            "currency",
            "currency_sign",
        )


userdata_schema = UserDataSchema()
usersdata_schema = UserDataSchema(many=True)


# set up the headers, so the cors would work
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "https://quitmate.onrender.com")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


@app.route("/signin", methods=["POST"])
def signin():
    try:
        username = request.json.get("username")
        password = request.json.get("password")

        # if inputs fields are blank
        if not username or not password:
            token = request.json["token"]
            if token:
                response = requests.get(
                    "https://people.googleapis.com/v1/people/me?personFields=names,metadata",
                    headers={"Authorization": f"Bearer {token}"},
                )
                google_id = response.json()["metadata"]["sources"][0]["id"]
                google_username = response.json()["names"][0]["displayName"]
                google_user = (
                    db.session.query(User).filter(User.google_id == google_id).first()
                )

                if google_user is None:
                    new_google_user = User(
                        username=google_username, hash=None, google_id=google_id
                    )
                    db.session.add(new_google_user)
                    db.session.commit()

                    google_user = (
                        db.session.query(User)
                        .filter(User.google_id == google_id)
                        .first()
                    )

                session["user_id"] = google_user.id
                return ""

            return "Oops! Username or password field is blank."

        user = db.session.query(User).filter(User.username == username).first()

        # if user doesn't exist or the password is incorrect
        if user is None or not check_password_hash(user.hash, password):
            return "Oops! Incorrect username or password."

        # set up the session
        session["user_id"] = user.id
        return ""
    except Exception as e:
        print(e)
        return f"Oops! We are sorry, something went wrong"


@app.route("/demo-user")
def demo():
    demo_password = os.getenv("DEMO_P")
    return {"demo": demo_password}


@app.route("/signup", methods=["POST"])
def signup():
    username = request.json.get("username")
    password = request.json.get("password")
    password_confirm = request.json.get("passwordConfirm")

    # if input fields are empty
    if not username or not password:
        return "Oops! Username or password field is blank."

    # if passwords don't match
    if password != password_confirm:
        return "Oops! Your passwords do not match."

    user = db.session.query(User).filter(User.username == username).first()

    if user:
        return "Oops! User with this username already exists."

    # add user to the database
    try:
        new_user = User(
            username=username, hash=generate_password_hash(password), google_id=None
        )
        db.session.add(new_user)
        db.session.commit()
        return ""

    except Exception as e:
        print(e)
        return f"Oops! Sorry for the inconvenience, we are having problems."


@app.route("/signout")
def signout():
    try:
        session.clear()
        return "Signed out"
    except Exception as e:
        return f"Something went wrong, /signout, {e}"


@app.route("/authorized")
def is_authorized():
    try:
        if "user_id" in session:
            user = db.session.query(User).filter(User.id == session["user_id"]).first()
            authorized = session["user_id"] is not None
            return {"authorized": authorized, "username": user.username}
        else:
            return {"authorized": False}
    except Exception as e:
        return f"Something went wrong, /authorized, {e}"


@app.route("/userdata", methods=["GET", "POST"])
def userdata():
    try:
        if request.method == "POST":
            last_smoked = request.json["date"]
            cig_daily = request.json["day"]
            cig_in_pack = request.json["pack"]
            pack_price = request.json["price"]
            currency = request.json["currency"]
            symbol = request.json["symbol"]

            new_data = UserData(
                user_id=session["user_id"],
                last_smoked=last_smoked,
                cig_daily=cig_daily,
                cig_in_pack=cig_in_pack,
                pack_price=pack_price,
                currency=currency,
                currency_sign=symbol,
            )
            print(last_smoked)
            try:
                db.session.add(new_data)
                db.session.commit()
                print("added")
            except Exception as e:
                print(e)

            return "Data was added"

        else:
            # check if data had already been added
            data = (
                db.session.query(UserData)
                .filter(UserData.user_id == session["user_id"])
                .first()
            )

            empty = data is None
            return {"empty": empty}
    except Exception as e:
        return f"Something went wrong, /userdata, {e}"


# sends all user's data
@app.route("/data")
def data():
    try:
        data = (
            db.session.query(UserData)
            .filter(UserData.user_id == session["user_id"])
            .first()
        )
        return {
            "data": [
                data.user_id,
                data.last_smoked,
                data.cig_daily,
                data.pack_price,
                data.cig_in_pack,
                data.currency,
                data.currency_sign,
            ]
        }
    except Exception as e:
        return f"Something went wrong, /data, {e}"


# resets user's time in the db
@app.route("/resettime", methods=["POST"])
def reset_time():
    try:
        new_time = request.json["time"]
        user_data = (
            db.session.query(UserData)
            .filter(UserData.user_id == session["user_id"])
            .first()
        )
        user_data.last_smoked = new_time
        db.session.commit()

        return "Time was reset."
    except Exception as e:
        return f"Something went wrong, /resettime, {e}"


# converts user's saved money into new currency
@app.route("/resetcurrency", methods=["POST"])
def reset_currency():
    try:
        api_key = os.getenv("API_KEY")
    except:
        return "API key was not set."

    try:
        new_currency = request.json.get("currency")
        symbol = request.json.get("symbol")

        data = (
            db.session.query(UserData)
            .filter(UserData.user_id == session["user_id"])
            .first()
        )
        price = data.pack_price
        currency = data.currency

        response = requests.get(
            f"https://api.apilayer.com/fixer/convert?to={new_currency}&from={currency}&amount={price}",
            headers={"apikey": api_key},
        )

        api_data = response.json()
        new_price = int(api_data["result"])

        data.pack_price = new_price
        data.currency = new_currency
        data.currency_sign = symbol
        db.session.commit()

        return "OKAY"
    except Exception as e:
        return f"Something went wrong, /resetcurrency, {e}"


# sets new password
@app.route("/changepassword", methods=["POST"])
def change_password():
    try:
        current_password = request.json.get("current")
        new_password = request.json.get("newP")
        confirm_password = request.json.get("confirm")

        user = db.session.query(User).filter(User.id == session["user_id"]).first()
        hash = user.hash

        if not check_password_hash(hash, current_password):
            return "Your current password is incorrect."

        if new_password != confirm_password:
            return "Please, enter your current password and the new password."

        user.hash = generate_password_hash(new_password)
        db.session.commit()

        return "Password was changed."
    except Exception as e:
        return f"Something went wrong, /changepassword, {e}"


# removes user from the db
@app.route("/removeuser")
def remove_user():
    try:
        user = db.session.query(User).filter(User.id == session["user_id"]).first()
        user_data = (
            db.session.query(UserData)
            .filter(UserData.user_id == session["user_id"])
            .first()
        )

        db.session.delete(user)
        db.session.delete(user_data)
        db.session.commit()

        session.clear()
        return "User was deleted."
    except Exception as e:
        return f"Something went wrong, /removeuser, {e}"


# checks if user has signed in with google
@app.route("/ifgoogleuser")
def google_user():
    google_user = db.session.query(User).filter(User.id == session["user_id"]).first()
    return {"google_user": not google_user.google_id is None}


if __name__ == "__main__":
    app.run(debug=False)
