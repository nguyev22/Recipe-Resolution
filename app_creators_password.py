from flask import Flask, render_template, redirect, session, url_for, request, abort, jsonify
from flask_mysqldb import MySQL


app = None   
mysql = None

def config_app(_app, _mysql):
    app = _app
    mysql = _mysql

    @app.route("/creators", methods=["GET"])
    def creator_page():
        return render_template("creators.html")
    
    @app.route("/login", methods=["GET"])
    def login_page():
        # if we get to this page with a session, we should pop the session credentials
        session.clear()

        return render_template("login.html")
    
    @app.route("/passwords", methods =["GET"])
    def passwords_page():
        return render_template("passwords.html")

    @app.route("/creator", methods=["GET"])
    def getCreator():
        '''
        Gets data from table Creators thru db
        '''
        result = db_getCreator()

        if result:
            return jsonify(result)

        return "An error occurred", 404


    @app.route("/creator", methods=["PUT"])
    def updateCreators():
        """
        Updates Creator username
        """
        try:
            post_data = request.get_json()
            db_updateCreator(post_data)
            return "ok", 200

        except Exception:
            return "error", 404
        
    @app.route("/creator", methods=["DELETE"])
    def deleteCreator():
        """
        Deletes a Creator
        """
        try:
            db_deleteCreator(request.args.get("id", None))
        except Exception:
            pass

        return "ok", 200

    
    @app.route("/login", methods=["POST"])
    def createUser():
        '''
        INSERT for both Creators and Passwords
        Takes input from user at /login page and checks database if username exists.
        If username exists, return error. Else, creates new username & pw.
        Takes no blank fields.
        '''
        # extract credentials
        post_data = request.get_json()
        user = post_data['user']
        password = post_data['password']

        # user exists, do not create new user
        if user_exists(user):
            return "User already exists", 404

        # create user and password in DB
        user, user_id = db_createUser(user, password)
        if user_id:
            # auto log in user and return
            session['user'] = user
            session['user_id'] = user_id
            return "ok", 200
        else:
            return "error", 400
        

    @app.route("/password", methods=["GET"])
    def getPassword():
        '''
        Gets data from table Passwords
        '''
        result = db_getPassword()
        print(result)
        return jsonify(result)

    @app.route("/password", methods=["PUT"])
    def updatePasswords():
        """
        Updates the password of creator in table Passwords
        """
        try:
            post_data = request.get_json()
            db_updatePassword(post_data)
            return "ok", 200

        except Exception:
            return "error", 404

    ################################################################################################
    # DB SIDE
    ################################################################################################
    def db_getCreator():
        query = """SELECT Creators.creatorID AS id, Creators.username AS name, COUNT(Recipes.creatorID) AS recipe_count
        FROM Creators
        LEFT JOIN Recipes on Recipes.creatorID = Creators.creatorID
        GROUP BY Creators.creatorID;"""

        cursor = mysql.connection.cursor()
        cursor.execute(query)

        return cursor.fetchall()

    def db_getPassword():
        query = """SELECT Creators.creatorID AS id, Creators.username AS creator_name, Passwords.password AS password 
        FROM Creators 
        INNER JOIN Passwords ON Creators.creatorID = Passwords.creatorID 
        ORDER BY username ASC;
        """
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()

    def db_createUser(name, password):
        """
        Create new user and password
        """

        try:
            assert(password != "")
            cursor = mysql.connection.cursor()

            # first query insert the user
            query = "INSERT INTO Creators (username) VALUES ('{}')".format(name)
            cursor.execute(query)
            user_row_id = cursor.lastrowid

            print(user_row_id)
            # query insert the password        
            query = "INSERT INTO Passwords (creatorID, password) VALUES ({}, '{}')".format(user_row_id, password)
            cursor.execute(query)

            # commit at the end to save both user and password
            mysql.connection.commit()

            return name, user_row_id
        except Exception as e:
            print(e)
            return None, None
        
    def user_exists(username):
        """
        Checks if input matches any username on database
        """
        # Connect to the database
        cursor = mysql.connection.cursor()

        # Query the database for the user
        query = ("SELECT * FROM Creators WHERE username = %s")
        cursor.execute(query, (username,))

        # Check if the user exists
        result = cursor.fetchone()
        if result:
            return True
        else:
            return False

    def db_updatePassword(post):
        """
        Update password on user id
        """
        query = "UPDATE Passwords SET password = '{}' WHERE creatorID = {}".format(post["password"], post["id"])
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()

    def db_updateCreator(post):
        """
        Update user to update the username
        """
        query = "UPDATE Creators SET username = '{}' WHERE creatorID = {}".format(post["name"], post["id"])
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()

    def db_deleteCreator(id):
        """
        Deletes Creator
        """
        query = "DELETE FROM Creators WHERE creatorID = {}".format(id)
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()