import os
import dotenv
from flask import Flask, render_template, redirect, session, url_for, request, abort, jsonify
from flask_mysqldb import MySQL
import app_creators_password, app_recipe, app_ingredients, app_components



app = Flask(__name__)
app.secret_key = "RecipeResolution"

dotenv.load_dotenv(dotenv.find_dotenv())

USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")

app.config['MYSQL_HOST'] = 'classmysql.engr.oregonstate.edu'
app.config['MYSQL_USER'] = USERNAME
app.config['MYSQL_PASSWORD'] = PASSWORD
app.config['MYSQL_DB'] = 'cs340_nguyech6'
app.config['MYSQL_CURSORCLASS'] = "DictCursor"

mysql = MySQL(app)

# home view
@app.route('/')
def home():
    return render_template('index.html')

# call on all subcomponents
app_recipe.config_app(app, mysql)
app_creators_password.config_app(app, mysql)
app_ingredients.config_app(app, mysql)
app_components.config_app(app, mysql)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3459)