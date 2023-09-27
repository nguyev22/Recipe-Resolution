
from flask import Flask, render_template, redirect, session, url_for, request, abort, jsonify
from flask_mysqldb import MySQL


app = None   
mysql = None

def config_app(_app, _mysql):
    app = _app
    mysql = _mysql

    @app.route('/recipes')
    def recipe_view():
        return render_template('recipes.html')

    @app.route("/recipe/<id>", methods=["GET"])
    def recipe_single(id):
        # if ID is create, then direct to create recipe page
        if id == "create":
            return render_template("create_recipe.html")
        else:
            return render_template("recipe.html", recipe_id=id)

    @app.route("/edit/<id>", methods=["GET"])
    def recipe_edit(id):
        
        recipe = db_getRecipe(id)
        print(recipe)
        return render_template("create_recipe.html", recipe=recipe)


    # ///////////////////////
    #        RECIPES
    # INSERT
    # UPDATE
    # DELETE 
    # ///////////////////////

    @app.route("/recipe", methods=["GET"])
    def getRecipes():
        # generate filter based on query string
        filter = dict()
        
        filter["creatorID"] = request.args.get("user", None)
        filter["ingredient"] = request.args.get("ingredient", None)

        return jsonify(db_getAllRecipe(filter))
    
    @app.route("/recipe/detailed/<id>", methods=["GET"])
    def getSingleRecipe(id):
        return jsonify(db_getRecipe(id))
        

    @app.route("/recipe", methods=["POST"])
    def createRecipe():
        post_data = request.get_json()
        try:
            db_createRecipe(post_data)
        
            return "ok", 200
        
        except:
            return "An error occurred", 404
        

    @app.route("/recipe/<id>", methods=["PUT"])
    def updateRecipe(id):
        recipe = request.get_json()
        
        db_updateRecipe(id, recipe)
        return "ok", 200

    @app.route("/recipe/<id>", methods=["DELETE"])
    def deleteRecipe(id):
        
        # perform delete
        db_deleteRecipe(id)
        return "ok", 200
        

    #####################################################################
    # Recipe
    #####################################################################
    def db_createRecipe(recipe):
        
        cursor = mysql.connection.cursor()
        
        # create recipe first
        query = """
        INSERT INTO Recipes (name, description, creatorID, dateCreated, private)
        VALUES ('{}', '{}', {}, {}, {}) 
        ;""".format(
            recipe["name"],
            recipe["description"],
            recipe["creatorID"] if recipe["creatorID"] is not None and recipe["creatorID"] != "" else "NULL",
            "CURDATE()",
            "b'1'" if recipe["private"] else "b'0'"
        )

        cursor.execute(query)
        recipe_id = cursor.lastrowid

        ###
        # create RecipeComponents to match

        for ingredient in recipe["ingredients"]:
            query = """
            INSERT INTO RecipeComponents (recipeID, ingredientID, quantity, unit, required)
            VALUES ({}, {}, {}, '{}', {})
            ;""".format(
                recipe_id,
                ingredient["id"],
                ingredient["quantity"] if ingredient["quantity"] else 0,
                ingredient["unit"] if ingredient["unit"] else "",
                "b'1'" if ingredient["required"] else "b'0'"
            )
            cursor.execute(query)
        

        mysql.connection.commit()
        
        

    def db_updateRecipe(id, recipe):
        query = """
        UPDATE Recipes SET name = '{}', description = '{}', creatorID = {}, private = {} WHERE recipeID = {};
        """.format(
            recipe["name"],
            recipe["description"],
            recipe["creatorID"] if recipe["creatorID"] is not None and recipe["creatorID"] != "" else "NULL",
            "b'1'" if recipe["private"] else "b'0'",
            int(id)
        )
        cursor = mysql.connection.cursor()
        cursor.execute(query)

        # because the modify page allows full manipulation of the recipe components, we will just delete all and readd all the new ones
        query = """
        DELETE FROM RecipeComponents WHERE recipeID = {};
        """.format(id)
        cursor.execute(query)

        for ingredient in recipe["ingredients"]:
            print(ingredient)
            query = """
            INSERT INTO RecipeComponents (recipeID, ingredientID, quantity, unit, required)
            VALUES ({}, {}, {}, '{}', {})
            ;""".format(
                id,
                ingredient["id"],
                ingredient["quantity"] if ingredient["quantity"] else 0,
                ingredient["unit"] if ingredient["unit"] else "",
                "b'1'" if ingredient["required"] else "b'0'"
            )
            print(query)
            cursor.execute(query)

        mysql.connection.commit()

    def db_getRecipe(id):
        """
        Get a singular recipe based on ID
        """
        # get recipe data
        recipe_query = """
        SELECT Recipes.recipeID AS id, Recipes.description AS description, 
        Recipes.name AS name, Recipes.dateCreated AS date, Creators.username AS creator,
        Recipes.creatorID AS creatorID,
        CAST(Recipes.private AS UNSIGNED) AS private
        FROM Recipes
        LEFT JOIN Creators ON Recipes.creatorID = Creators.creatorID
        LEFT JOIN RecipeComponents ON Recipes.recipeID = RecipeComponents.recipeID
        WHERE Recipes.recipeID = {}
        ;""".format(id)
        cursor = mysql.connection.cursor()
        cursor.execute(recipe_query)
        recipe_result = cursor.fetchall()[0]

        # get ingredient data
        ingredient_query = """
        SELECT Ingredients.ingredientID AS id, Ingredients.name as name,
        RecipeComponents.quantity as quantity, RecipeComponents.unit as unit,
        CAST(RecipeComponents.required AS UNSIGNED) as required
        FROM Ingredients
        RIGHT JOIN RecipeComponents ON Ingredients.ingredientID = RecipeComponents.ingredientID
        WHERE RecipeComponents.recipeID = {}
        """.format(id)
        cursor.execute(ingredient_query)
        ingredient_result = cursor.fetchall()

        # combine the dictionaries
        recipe_result["ingredients"] = ingredient_result

        return recipe_result



    def db_getAllRecipe(filter):
        """
        Get all recipes by applying filter
        """
        
        creator_string = ""
        if "creatorID" in filter and filter["creatorID"] is not None and filter["creatorID"] is not "":
            creator_string = "Recipes.creatorID = {}".format(filter["creatorID"])

        ingredient_string = ""
        if "ingredient" in filter and filter["ingredient"] is not None and filter["ingredient"] is not "":
            ingredient_string = "RecipeComponents.ingredientID = {}".format(filter["ingredient"])

        filters = []
        if creator_string:
            filters.append(creator_string)
        if ingredient_string:
            filters.append(ingredient_string)

        filter_string = ""
        if creator_string != "" or ingredient_string != "":
            filter_string = "WHERE " + " AND ".join(filters)

        query = """
        SELECT Recipes.recipeID AS id, Recipes.name AS name, COUNT(DISTINCT RecipeComponents.ingredientID) AS ingredient_count, Creators.username AS creator,
        CAST(Recipes.private AS UNSIGNED) AS private, 
        Recipes.dateCreated AS date
        FROM Recipes
        LEFT JOIN Creators ON Recipes.creatorID = Creators.creatorID
        LEFT JOIN RecipeComponents ON Recipes.recipeID = RecipeComponents.recipeID
        {}
        GROUP BY Recipes.recipeID
        ;""".format(filter_string)
        print(query)

        cursor = mysql.connection.cursor()
        cursor.execute(query)

        return cursor.fetchall()

    def db_deleteRecipe(id):
        query = "DELETE FROM Recipes WHERE recipeID = {}".format(id)
        cursor = mysql.connection.cursor()
        cursor.execute(query)
        mysql.connection.commit()
