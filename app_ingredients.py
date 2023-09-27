
from flask import Flask, render_template, redirect, session, url_for, request, abort, jsonify
from flask_mysqldb import MySQL


app = None   
mysql = None

def config_app(_app, _mysql):
    app = _app
    mysql = _mysql

    @app.route("/ingredients", methods=["GET"])
    def ingredient_page():
        return render_template("ingredients.html")
    
        
    # ///////////////////////
    #      INGREDIENTS
    # ///////////////////////
    @app.route("/ingredient", methods=["GET"])
    def getIngredients():
        """
        Gets the ingredients table w/ filter
        """
        result = db_getIngredient({
            "min": request.args.get("min", None),
            "max": request.args.get("max", None)
        })
        return jsonify(result)


    @app.route("/ingredient", methods=["POST"])
    def createIngredient():
        """
        Creates an Ingredient
        """
        post_data = request.get_json()
        result = db_createIngredient(post_data["name"])

        if result:
            return "ok", 200

        return "An error occurred", 404

    @app.route("/ingredient", methods=["DELETE"])
    def deleteIngredient():
        """
        Deletes an ingredient
        """
        try:
            db_deleteIngredient(request.args.get("id", None))
        except Exception:
            pass

        return "ok", 200

    @app.route("/ingredient", methods=["PUT"])
    def updateIngredient():
        """
        Updates an ingredient
        """
        try:
            post_data = request.get_json()
            db_updateIngredient(post_data)
            return "ok", 200

        except Exception:
            return "error", 404

    #####################################################################
    # Ingredient
    #####################################################################
    def db_createIngredient(name):
        # generate the query
        query = "INSERT INTO Ingredients (name) VALUES ('{}');".format(name)

        # execute the query
        cursor = mysql.connection.cursor()
        try:
            cursor.execute(query)
            mysql.connection.commit()
            return True
        except Exception as e:
            return False

    def db_getIngredient(filter=None):
        # Generate the filter query
        filter_query = ""
        if filter is not None:
            
            if "min" in filter and filter["min"] is not None:
                filter_query = "HAVING recipeCount >= {}".format(filter["min"])
            else:
                filter_query = "HAVING recipeCount >= 0"
            
            if "max" in filter and filter["max"] is not None:
                filter_query += " AND recipeCount <= {}".format(filter["max"])

        query = """
        SELECT Ingredients.ingredientID AS id, Ingredients.name AS name, COUNT(DISTINCT(RecipeComponents.recipeID)) AS recipeCount
        FROM Ingredients 
        LEFT JOIN RecipeComponents ON Ingredients.ingredientID = RecipeComponents.ingredientID 
        GROUP BY Ingredients.ingredientID
        {}
        ORDER BY Ingredients.name
        ;
        """.format(filter_query)
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()

    def db_updateIngredient(filter):
        query = "UPDATE Ingredients SET name = '{}' WHERE ingredientId = {}".format(filter["name"], filter["id"])
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()

    def db_deleteIngredient(id):
        query = "DELETE FROM Ingredients WHERE ingredientId = {}".format(id)
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()

