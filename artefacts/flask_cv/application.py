import os
import sqlite3
from cs50 import SQL
from jinja2 import Template
from flask import Flask, flash, jsonify, redirect, render_template, request, session,url_for, send_file
from werkzeug.utils import secure_filename
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
import base64
from PIL import Image
from io import BytesIO
import sys,os,codecs
from flask import Flask, session
from flask_session import Session

# start the program
# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'super secret key'
sess = Session()

# Configure CS50 Library to use SQLite database

d = sqlite3.connect("cv.db",check_same_thread=False)
db = d.cursor()

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

# The initial page consists of a registration field where the user has to register himself first. If he is registered he can directly navigate to login page
@app.route("/", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method=="POST":
                # Ensure username was submitted
        s=db.execute("select username from users").fetchall()
        # the next lines are important to check if the user isn't already registered. Because db.execute commands always end up in dictionaries, I create an empty list L and iterate over the dictionary and add all the already registered names in this list.
        print(s)
        L=[]
        for i in s:
            for j in i:
                L.append(j)
        print(L)
        # Now I can check things: If no password provided or if the user is already registered. If so, send an error message.
        if request.form.get("confirmation") != request.form.get("password"):
            return ("Your confirmation does not match your password")
        elif request.form.get("username") in L:
            return ("you are already registered")
        # If all is ok (username and password provided), then add this user to the database and go to login.
        elif request.form.get("username") and request.form.get("password"):

            username=request.form.get("username")
            hashpap=generate_password_hash(request.form.get("password"))
            db.execute("INSERT INTO users (username,hash) VALUES(?,?)", (username,hashpap))
            return redirect("/login")

        else:

            return redirect("/login")

    if request.method=="GET":
        return render_template("register_final.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return ("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return ("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", (request.form.get("username"),)).fetchall()
        print(rows)
        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0][2], request.form.get("password")):
            return ("invalid username and/or password", 403)
        # Remember which user has logged in
        session["user_id"] = rows[0][0]

        # Redirect user to home page
        return redirect("/userinput")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login_final.html")

@app.route("/userinput", methods=["GET","POST"])
def index():
    # Part 1: Personal Data
    # Main set up for userinput: If reauest method is post, then look which first field was filled in. For example if personal data, I expect that "name" is provied. If so, then add the data into the personal table
    if request.method == "POST" and request.form.get("name"):

        # Assuming that the user submitted/saved personal data, then get the input of all these fields with reauest.form.get method.
        IDe=session["user_id"]
        name = request.form.get("name")
        address = request.form.get("address")
        email = request.form.get("email")
        phone = request.form.get("phone")
        nationality = request.form.get("nationality")
        date_of_birth = request.form.get("date_of_birth")
        professional = request.form.get("professional")

        # Because there are two scenarios: First, the user could provide some input for the first time, then user insert command. If he is already registered in personal table, then adapt all the fields
        if name:

            p_0=db.execute("select * from personal where ID=?",(IDe,)).fetchall()
            if p_0==[]:

                db.execute("INSERT INTO personal (name,address,email,phone,nationality,date_of_birth,professional,ID) VALUES(?,?,?,?,?,?,?,?)", (name,address,email,phone,nationality,date_of_birth,professional,IDe))
                d.commit()

            else:

                p=db.execute("select ID from personal where ID=?",(IDe,))

                db.execute("update personal set (name,address,email,phone,nationality,date_of_birth,professional)=(?,?,?,?,?,?,?) where ID=?", (name,address,email,phone,nationality,date_of_birth,professional,IDe))
                d.commit()

        return redirect ("/userinput")

    # Part 2: Experience
    # Now checking if the saved item was an "experience" field, if so, then take this "elif" route
    elif request.method == "POST" and request.form.get("s0"):

        # because my fields in the html were provided dwnamically, I don't know in advance how many fields there are. therefore i Use a sufficiently large range (0,100) and then add 100 userinput fields to a dictionary which have all the same id and name structure in the html
        # Then I check afterwards whether a field in the dictionary is empty or not. If empty, then I remove again.
        # This process I repeat for all fields in experience
        a_dictionary = {}
        for number in range(0,100):
            a_dictionary["start%s" %number] = request.form.get("s{}".format(number))
        for k, v in dict(a_dictionary).items():
            if v is None:
                del a_dictionary[k]
        print(a_dictionary)
        b_dictionary = {}
        for number in range(0,100):
            b_dictionary["ende%s" %number] = request.form.get("e{}".format(number))
        for k, v in dict(b_dictionary).items():
            if v is None:
                del b_dictionary[k]
        c_dictionary = {}
        for number in range(0,100):
            c_dictionary["company%s" %number] = request.form.get("c{}".format(number))
        for k, v in dict(c_dictionary).items():
            if v is None:
                del c_dictionary[k]
        d_dictionary = {}
        for number in range(0,100):
            d_dictionary["description%s" %number] = request.form.get("d{}".format(number))
        for k, v in dict(d_dictionary).items():
            if v is None:
                del d_dictionary[k]
        p_exp_dictionary = {}
        for number in range(0,100):
            p_exp_dictionary["place_exp%s" %number] = request.form.get("p_expe{}".format(number))
        for k, v in dict(p_exp_dictionary).items():
            if v is None:
                del p_exp_dictionary[k]

        # Now check once again, if the user is already saved in experience in the database or not. If not, then add all the user input - see the for loop.
        IDe=session["user_id"]
        p_0=db.execute("select * from experience2 where id=?",(IDe,)).fetchall()
        if p_0==[]:
            l=len(a_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO experience2 (start_date,end_date,company,description,Place,id) VALUES(?,?,?,?,?,?)", (a_dictionary["start%s" %i],b_dictionary["ende%s" %i],c_dictionary["company%s" %i],d_dictionary["description%s" %i],p_exp_dictionary["place_exp%s" %i],IDe))
                d.commit()
                i += 1
        # If already saved in experience table in the database, then delete all the rows that have been saved before and insert the new ones.
        else:

            p=db.execute("select ID from experience2 where id=?",(IDe,))

            db.execute("DELETE FROM experience2 WHERE id=?",(IDe,))
            l=len(a_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO experience2 (start_date,end_date,company,description,Place,id) VALUES(?,?,?,?,?,?)", (a_dictionary["start%s" %i],b_dictionary["ende%s" %i],c_dictionary["company%s" %i],d_dictionary["description%s" %i],p_exp_dictionary["place_exp%s" %i],IDe))
                d.commit()
                i += 1

        # Save and go back to the page
        return redirect ("/userinput")

    # Part 3: Education
    # Now check the same if the user input provided was an "education" field
    elif request.method == "POST" and request.form.get("s_educ0"):
        # Make once again the size of the check repetition sufficiently large and add it to new empty dictionaries. then prove whether an index in the dictionary is empty or not. If so, remove.
        e_dictionary = {}
        for number in range(0,100):
            e_dictionary["start2%s" %number] = request.form.get("s_educ{}".format(number))
        for k, v in dict(e_dictionary).items():
            if v is None:
                del e_dictionary[k]
        print(e_dictionary)
        f_dictionary = {}
        for number in range(0,100):
            f_dictionary["ende2%s" %number] = request.form.get("e_educ{}".format(number))
        for k, v in dict(f_dictionary).items():
            if v is None:
                del f_dictionary[k]
        g_dictionary = {}
        for number in range(0,100):
            g_dictionary["institution%s" %number] = request.form.get("i{}".format(number))
        for k, v in dict(g_dictionary).items():
            if v is None:
                del g_dictionary[k]
        h_dictionary = {}
        for number in range(0,100):
            h_dictionary["study%s" %number] = request.form.get("study{}".format(number))
        for k, v in dict(h_dictionary).items():
            if v is None:
                del h_dictionary[k]
        i_dictionary = {}
        for number in range(0,100):
            i_dictionary["level%s" %number] = request.form.get("l{}".format(number))
        for k, v in dict(i_dictionary).items():
            if v is None:
                del i_dictionary[k]
        p_educ_dictionary = {}
        for number in range(0,100):
            p_educ_dictionary["p_educ_%s" %number] = request.form.get("p_educ{}".format(number))
        for k, v in dict(p_educ_dictionary).items():
            if v is None:
                del p_educ_dictionary[k]

        # prove again whether the user is already saved in the education table in the database
        # The use different commands, insert versus delete and insert.
        IDe=session["user_id"]
        p_0=db.execute("select * from education2 where ide=?",(IDe,)).fetchall()
        if p_0==[]:

            l=len(e_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO education2 (start_date,end_date,institution,study,level,Place,ide) VALUES(?,?,?,?,?,?,?)", (e_dictionary["start2%s" %i],f_dictionary["ende2%s" %i],g_dictionary["institution%s" %i],h_dictionary["study%s" %i],i_dictionary["level%s" %i],p_educ_dictionary["p_educ_%s" %i],IDe))
                d.commit()
                i += 1

        else:

            p=db.execute("select ide from education2 where ide=?",(IDe,))
            db.execute("DELETE FROM education2 WHERE ide=?",(IDe,))
            l=len(e_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO education2 (start_date,end_date,institution,study,level,Place,ide) VALUES(?,?,?,?,?,?,?)", (e_dictionary["start2%s" %i],f_dictionary["ende2%s" %i],g_dictionary["institution%s" %i],h_dictionary["study%s" %i],i_dictionary["level%s" %i],p_educ_dictionary["p_educ_%s" %i],IDe))
                d.commit()
                i += 1
        # save and redirect to the page
        return redirect ("/userinput")

    # Part 4: Skills
    # Repeat the steps seen before
    elif request.method == "POST" and request.form.get("skills0"):

        j_dictionary = {}
        for number in range(0,100):
            j_dictionary["skills%s" %number] = request.form.get("skills{}".format(number))
        for k, v in dict(j_dictionary).items():
            if v is None:
                del j_dictionary[k]

        IDe=session["user_id"]
        p_0=db.execute("select * from skills where IDE=?",(IDe,)).fetchall()
        if p_0==[]:

            l=len(j_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO skills (type,IDE) VALUES(?,?)", (j_dictionary["skills%s" %i],IDe))
                d.commit()
                i += 1
        else:

            p=db.execute("select IDE from skills where IDE=?",(IDe,))
            db.execute("DELETE FROM skills WHERE IDE=?",(IDe,))
            l=len(j_dictionary)
            for i in range(0,l):
                db.execute("INSERT INTO skills (type,IDE) VALUES(?,?)", (j_dictionary["skills%s" %i],IDe))
                d.commit()
                i += 1


        return redirect ("/userinput")

    else:

        return render_template("final2.html")

# Part 5: Photo
# Looks if the user provided a photo
# If so, save the filename given by the user and read the entire raw data and save this into the database.
@app.route("/photo", methods=["GET","POST"])
def photo():

    if request.method == "POST":
        IDe=session["user_id"]
        file = request.files['picture']
        filename=file.filename
        file=file.read()

        db.execute("INSERT INTO image (ide,name, data) VALUES(?,?,?)", (IDe,str(filename),file))
        d.commit()

        return redirect ("/result")

    else:

        return render_template("third_final.html")

# The next route only chooses the image of the current user and displays it in a separated route.
# The Layout_cv.html then uses the image in terms of using the url where the image is displayed.
@app.route("/res2", methods=["GET"])
def result2():

    picture=db.execute("select ide, name, data from image order by name desc limit 1")
    for x in picture.fetchall():
        name_v=x[1]
        data_v=x[2]

    return send_file(BytesIO(data_v),attachment_filename='python.jpg')

# The next route is the place where the layout of the CV will be displayed. Therefore select all the information of the current user and bring it in Layout_cv.html together.
@app.route("/result", methods=["GET"])
def result():

    IDe=session["user_id"]
    personal=db.execute("select * from personal order by ID desc limit 1")
    personal=personal.fetchone()
    experience=db.execute("select start_date,end_date,company,description,Place from experience2 where id=?",(IDe,))
    experience=experience.fetchall()
    education=db.execute("select start_date,end_date,institution,study,level,Place from education2 where ide=?",(IDe,))
    education=education.fetchall()
    skills=db.execute("select type from skills where IDE=?",(IDe,))
    skills=skills.fetchall()
    print(skills)
    return render_template("Layout_cv.html", personal=personal, experience=experience,education=education,skills=skills)

# This rout allows the user to logout
@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")
