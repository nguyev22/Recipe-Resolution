
from flask import Flask, render_template, redirect, session, url_for, request, abort, jsonify
from flask_mysqldb import MySQL


app = None   
mysql = None

def config_app(_app, _mysql):
    app = _app
    mysql = _mysql
        
    @app.route("/recipe_components", methods =["GET"])
    def recipe_components_page():
        return render_template("recipe_components.html", )

    @app.route("/recipe_component", methods =["GET"])
    def get_components():
        return jsonify(db_getRecipeComponents())

    @app.route("/recipe_component", methods =["POST"])
    def create_rc():
        post_data = request.get_json()
        db_createRecipeComponent(post_data)
        return "ok", 200
    
    @app.route("/recipe_component/<id>", methods=["DELETE"])
    def delete_rc(id):
        db_deleteRecipeComponent(id)
        return "ok", 200

    # API endpoints

    #####################################################################
    # RecipeComponent TODO
    #####################################################################
    def db_createRecipeComponent(rc):
        query = """
        INSERT INTO RecipeComponents 
        (recipeID, ingredientID, quantity, unit, required)
        VALUES ({}, {}, {}, '{}', {});
        """.format(
            rc["recipeID"],
            rc["ingredientID"],
            rc["quantity"] if rc["quantity"] else 0,
            rc["unit"] if rc["unit"] else "",
            "b'1'" if rc["required"] else "b'0'",
        )

        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()

    def db_getRecipeComponents():
        query = """
        SELECT rc.componentID as id, rc.recipeID as recipe_id, rc.ingredientID as ingredient_id,
        rc.quantity as quantity, rc.unit as unit, CAST(rc.required AS UNSIGNED) as required,
        Recipes.name AS recipe_name, Ingredients.name AS ingredient_name
        FROM RecipeComponents rc
        LEFT JOIN Recipes ON Recipes.recipeID = rc.recipeID
        LEFT JOIN Ingredients ON Ingredients.ingredientID = rc.ingredientID
        ORDER BY id
        ;"""

        cursor = mysql.connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()

    def db_deleteRecipeComponent(id):
        query = "DELETE FROM RecipeComponents WHERE componentID = {}".format(id)
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()
