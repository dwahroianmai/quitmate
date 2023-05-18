import os
import requests
from flask import Flask, request, session
from flask_session import Session
import mysql.connector
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS

# server_url = "http://127.0.0.1:5000"
# react_url  = "http://127.0.0.1:3000"

app = Flask(__name__)

# configure app
# controls permanent session storage
app.config["SESSION_PERMANENT"] = False
# controls how session is stored (files on the server's file system in this case)
app.config["SESSION_TYPE"] = "filesystem"
# security measure, prevents JavaScript from accessing cookie
app.config["SESSION_COOKIE_HTTPONLY"] = True
# cors
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_NAME"] = "cookie_name"

Session(app)
CORS(app, supports_credentials=True)

# connect the database
db_password = os.getenv("DB_PASSWORD")
cnx = mysql.connector.connect(
    user="root", password=db_password, host="localhost", database="quitmate"
)
cursor = cnx.cursor(buffered=True)


# set up the headers, so the cors would work
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "http://127.0.0.1:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response


@app.route("/signin", methods=["POST"])
def signin():
    try:
        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

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
                get_user = "SELECT * FROM users WHERE google_id = %s"

                cursor.execute(get_user, (google_id,))
                google_user = cursor.fetchall()
                cursor.close()

                if len(google_user) == 0:
                    cnx = mysql.connector.connect(
                        user="root",
                        password=db_password,
                        host="localhost",
                        database="quitmate",
                    )
                    cursor = cnx.cursor(buffered=True)

                    add_google_user = (
                        "INSERT INTO users (google_id, username) VALUES (%s, %s)"
                    )
                    cursor.execute(add_google_user, (google_id, google_username))
                    cnx.commit()
                    cursor.close()

                session["user_id"] = google_user[0][0]
                return ""

            return "Oops! Username or password field is blank."

        select_user = "SELECT * FROM users WHERE username = %s"
        username = cursor.execute(select_user, (username,))
        result = cursor.fetchall()
        cursor.close()

        # if user doesn't exist or the password is incorrect
        if len(result) != 1 or not check_password_hash(result[0][2], password):
            return "Oops! Incorrect username or password."

        # set up the session
        session["user_id"] = result[0][0]
        return ""
    except Exception as e:
        print(e)
        return f"Oops! We are sorry, something went wrong"


@app.route("/signup", methods=["POST"])
def signup():
    cnx = mysql.connector.connect(
        user="root", password=db_password, host="localhost", database="quitmate"
    )
    cursor = cnx.cursor(buffered=True)

    username = request.json.get("username")
    password = request.json.get("password")
    password_confirm = request.json.get("passwordConfirm")

    # if input fields are empty
    if not username or not password:
        return "Oops! Username or password field is blank."

    # if passwords don't match
    if password != password_confirm:
        return "Oops! Your passwords do not match."

    get_user = "SELECT * FROM users WHERE username = %s"

    # check if user already exists
    existing_user = cursor.execute(get_user, (username,))
    result = cursor.fetchall()
    cursor.close()

    if len(result) != 0:
        return "Oops! User with this username already exists."

    cnx = mysql.connector.connect(
        user="root", password=db_password, host="localhost", database="quitmate"
    )
    cursor = cnx.cursor(buffered=True)

    add_user = "INSERT INTO users (username, hash) VALUES (%s, %s)"
    password_hash = generate_password_hash(password)

    # add user to the database
    try:
        cursor.execute(add_user, (username, password_hash))
        cnx.commit()
        cursor.close()
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
        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        get_username = "SELECT username FROM users WHERE id = %s"

        if "user_id" in session:
            cursor.execute(get_username, (session["user_id"],))
            username = cursor.fetchall()
            cursor.close()

            authorized = session["user_id"] is not None
            return {"authorized": authorized, "username": username}
        else:
            return {"authorized": False}
    except Exception as e:
        return f"Something went wrong, /authorized, {e}"


@app.route("/userdata", methods=["GET", "POST"])
def userdata():
    try:
        if request.method == "POST":
            cnx = mysql.connector.connect(
                user="root", password=db_password, host="localhost", database="quitmate"
            )
            cursor = cnx.cursor(buffered=True)

            user_id = session["user_id"]
            last_smoked = request.json["date"]
            cig_daily = request.json["day"]
            cig_in_pack = request.json["pack"]
            pack_price = request.json["price"]
            currency = request.json["currency"]
            symbol = request.json["symbol"]

            get_id = "SELECT id FROM users WHERE google_id = %s"
            cursor.execute(get_id, (session["user_id"],))
            result = cursor.fetchall()

            if len(result) != 0:
                user_id = result[0][0]

            cnx.close()

            cnx = mysql.connector.connect(
                user="root", password=db_password, host="localhost", database="quitmate"
            )
            cursor = cnx.cursor(buffered=True)

            insert_into = (
                "INSERT INTO userdata (user_id, last_smoked, cig_daily, pack_price, cig_in_pack, currency, currency_sign) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s)"
            )

            cursor.execute(
                insert_into,
                (
                    user_id,
                    last_smoked,
                    cig_daily,
                    pack_price,
                    cig_in_pack,
                    currency,
                    symbol,
                ),
            )
            cnx.commit()
            cursor.close()
            return "Data was added"

        else:
            # check if data has already been added
            cnx = mysql.connector.connect(
                user="root", password=db_password, host="localhost", database="quitmate"
            )
            cursor = cnx.cursor(buffered=True)

            select_data = "SELECT * FROM userdata WHERE user_id = %s"
            cursor.execute(select_data, (session["user_id"],))
            data = cursor.fetchall()
            cursor.close()
            empty = len(data) == 0
            return {"empty": empty}
    except Exception as e:
        return f"Something went wrong, /userdata, {e}"


# sends all user's data
@app.route("/data")
def data():
    try:
        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        select_data = "SELECT * FROM userdata WHERE user_id = %s"

        cursor.execute(select_data, (session["user_id"],))
        data = cursor.fetchall()
        cursor.close()
        return {"data": data}
    except Exception as e:
        return f"Something went wrong, /data, {e}"


# resets user's time in the db
@app.route("/resettime", methods=["POST"])
def reset_time():
    try:
        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        new_time = request.json["time"]

        update = "UPDATE userdata SET last_smoked = %s WHERE user_id = %s"

        cursor.execute(
            update,
            (
                new_time,
                session["user_id"],
            ),
        )
        cnx.commit()
        cursor.close()
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

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        get_old_data = "SELECT pack_price, currency FROM userdata WHERE user_id = %s"

        cursor.execute(get_old_data, (session["user_id"],))
        result = cursor.fetchall()
        cursor.close()

        price = result[0][0]
        old_currency = result[0][1]

        response = requests.get(
            f"https://api.apilayer.com/fixer/convert?to={new_currency}&from={old_currency}&amount={price}",
            headers={"apikey": api_key},
        )

        data = response.json()
        new_price = int(data["result"])

        update_currency = (
            "UPDATE userdata "
            "SET pack_price = %s, currency = %s, currency_sign = %s "
            "WHERE user_id = %s"
        )

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        cursor.execute(
            update_currency, (new_price, new_currency, symbol, session["user_id"])
        )
        cnx.commit()
        cursor.close()
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

        get_hash = "SELECT hash FROM users WHERE id = %s"

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        cursor.execute(get_hash, (session["user_id"],))
        result = cursor.fetchall()
        cursor.close()

        if not check_password_hash(result[0][0], current_password):
            return "Your current password is incorrect."

        if new_password != confirm_password:
            return "Please, enter your current password and the new password."

        update_password = "UPDATE users SET hash = %s WHERE id = %s"

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        cursor.execute(
            update_password, (generate_password_hash(new_password), session["user_id"])
        )
        cnx.commit()
        cursor.close()

        return "Password was changed."
    except Exception as e:
        return f"Something went wrong, /changepassword, {e}"


# removes user from the db
@app.route("/removeuser")
def remove_user():
    try:
        delete_userdata = "DELETE FROM userdata WHERE user_id = %s"
        delete_user = "DELETE FROM users WHERE id = %s"

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        cursor.execute(delete_userdata, (session["user_id"],))
        cnx.commit()
        cursor.close()

        cnx = mysql.connector.connect(
            user="root", password=db_password, host="localhost", database="quitmate"
        )
        cursor = cnx.cursor(buffered=True)

        cursor.execute(delete_user, (session["user_id"],))
        cnx.commit()
        cursor.close()
        session.clear()
        return "User was deleted."
    except Exception as e:
        return f"Something went wrong, /removeuser, {e}"


# checks if user has signed in with google
@app.route("/ifgoogleuser")
def google_user():
    cnx = mysql.connector.connect(
        user="root", password=db_password, host="localhost", database="quitmate"
    )
    cursor = cnx.cursor(buffered=True)

    google_id = "SELECT google_id FROM users WHERE id = %s"

    cursor.execute(google_id, (session["user_id"],))
    result = cursor.fetchall()
    cnx.close()

    if result[0][0] is None:
        return {"google_user": False}
    return {"google_user": True}


if __name__ == "__main__":
    app.run(debug=True)
