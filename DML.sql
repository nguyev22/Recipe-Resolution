-- Project Title: Recipe Resolution
-- Team Members: Christopher Nguyen, Vi Nguyen
-- Team Number: 30

------------------------------------------------

-- INSERT Operand
-- // Insert new data into Recipes Table//
INSERT INTO Recipes (name, description, creatorID, dateCreated) VALUES
(:recipenameInput, :descriptionInput, :creatoridInput, :dateInput);

-- // Insert new data into RecipeComponents Table//
INSERT INTO RecipeComponents (recipeID, ingredientID, quantity, unit) VALUES
(:recipeidInput, :ingredientidInput, :quantityInput, :unitInput);

-- // Insert new data into Creators Table//
INSERT INTO Creators (username) VALUES
(:usernameInput);

-- // Insert new data into Ingredients Table//
INSERT INTO Ingredients (name) VALUES
(:ingredientInput);

-- // Insert new data into Passwords Table//
INSERT INTO Passwords (creatorID, password) VALUES
(:creatoridInput, :passwordInput);

------------------------------------------------

-- SELECT Operand

-- Display all data from Recipes table
SELECT Recipes.recipeID AS id, Recipes.name AS name, COUNT(DISTINCT RecipeComponents.ingredientID) AS ingredient_count, Creators.username AS creator,
CAST(Recipes.private AS UNSIGNED) AS private, 
Recipes.dateCreated AS date
FROM Recipes
LEFT JOIN Creators ON Recipes.creatorID = Creators.creatorID
LEFT JOIN RecipeComponents ON Recipes.recipeID = RecipeComponents.recipeID
{}
GROUP BY Recipes.recipeID
;

        -- +----+-------------------+------------------+-----------------+---------+------------+
        -- | id | name              | ingredient_count | creator         | private | date       |
        -- +----+-------------------+------------------+-----------------+---------+------------+
        -- |  1 | Lasagna           |                1 | JohnDoe123      |    NULL | 2020-03-19 |
        -- |  2 | Mac and Cheese    |                2 | KimOnAWhim789   |    NULL | 2022-11-17 |
        -- |  3 | Meatloaf          |                2 | WillCook4Will99 |    NULL | 2017-06-06 |
        -- |  4 | Soy Sauce Chicken |                2 | NULL            |       0 | 2019-09-25 |
        -- +----+-------------------+------------------+-----------------+---------+------------+

-- Displays Ingredient id, name, and unique recipeCount
SELECT Ingredients.ingredientID AS id, Ingredients.name AS name, COUNT(DISTINCT(RecipeComponents.recipeID)) AS recipeCount
FROM Ingredients 
LEFT JOIN RecipeComponents ON Ingredients.ingredientID = RecipeComponents.ingredientID 
GROUP BY Ingredients.ingredientID
{}
ORDER BY Ingredients.name
        -- +----+------------------+-------------+
        -- | id | name             | recipeCount |
        -- +----+------------------+-------------+
        -- |  4 | Chicken          |           1 |
        -- |  3 | Ground Beef      |           2 |
        -- |  5 | Ketchup          |           1 |
        -- |  2 | Mozarella Cheese |           1 |
        -- |  6 | Soy Sauce        |           2 |
        -- |  1 | Tomatos          |           0 |
        -- +----+------------------+-------------+

-- Displays username of Creators and how many recipes they have created
SELECT Creators.creatorID AS id, Creators.username AS name, COUNT(Recipes.creatorID) AS recipe_count
FROM Creators
LEFT JOIN Recipes on Recipes.creatorID = Creators.creatorID
GROUP BY Creators.creatorID;

        -- +----+-----------------+--------------+
        -- | id | name            | recipe_count |
        -- +----+-----------------+--------------+
        -- |  1 | JohnDoe123      |            1 |
        -- |  2 | KimOnAWhim789   |            1 |
        -- |  3 | WillCook4Will99 |            1 |
        -- |  4 | JackAndJill     |            0 |
        -- +----+-----------------+--------------+

-- Displays Password with id, creator_name, password
SELECT Creators.creatorID AS id, Creators.username AS creator_name, Passwords.password AS password 
FROM Creators 
INNER JOIN Passwords ON Creators.creatorID = Passwords.creatorID 
ORDER BY username ASC;

        -- +----+-----------------+------------------+
        -- | id | creator_name    | password         |
        -- +----+-----------------+------------------+
        -- |  4 | JackAndJill     | jackandjill      |
        -- |  1 | JohnDoe123      | 123Password      |
        -- |  2 | KimOnAWhim789   | Password456      |
        -- |  3 | WillCook4Will99 | amishparadise123 |
        -- |  5 | yay             | yip              |
        -- +----+-----------------+------------------+

-- Displays Recipe Components table with id, recipe_id, ingredient_id, quantity, unit, required, recipe_name, ingredient_name
SELECT rc.componentID as id, rc.recipeID as recipe_id, rc.ingredientID as ingredient_id,
rc.quantity as quantity, rc.unit as unit, CAST(rc.required AS UNSIGNED) as required,
Recipes.name AS recipe_name, Ingredients.name AS ingredient_name
FROM RecipeComponents rc
LEFT JOIN Recipes ON Recipes.recipeID = rc.recipeID
LEFT JOIN Ingredients ON Ingredients.ingredientID = rc.ingredientID
ORDER BY id;
        -- +----+-----------+---------------+-----------+-------+----------+-------------------+------------------+
        -- | id | recipe_id | ingredient_id | quantity  | unit  | required | recipe_name       | ingredient_name  |
        -- +----+-----------+---------------+-----------+-------+----------+-------------------+------------------+
        -- |  2 |         2 |             2 |   1.00000 | cup   |     NULL | Mac and Cheese    | Mozarella Cheese |
        -- |  3 |         3 |             3 | 800.00000 | grams |     NULL | Meatloaf          | Ground Beef      |
        -- |  6 |         3 |             5 | 250.00000 | grams |     NULL | Meatloaf          | Ketchup          |
        -- | 28 |         1 |             6 |   1.00000 |       |        1 | Lasagna           | Soy Sauce        |
        -- | 39 |         2 |             3 |   1.00000 |       |        0 | Mac and Cheese    | Ground Beef      |
        -- | 42 |         4 |             4 |   2.00000 | lbs   |        1 | Soy Sauce Chicken | Chicken          |
        -- | 43 |         4 |             6 | 150.00000 | mLs   |        1 | Soy Sauce Chicken | Soy Sauce        |
        -- +----+-----------+---------------+-----------+-------+----------+-------------------+------------------+
------------------------------------------------

-- UPDATE Operand
-- UPDATE name, description, and creatorID of Recipes where it was created on this date
UPDATE Recipes
    SET name = :recipenameInput, description = :descriptionInput, creatorID = :creatoridInput
    WHERE dateCreated = :dateInput;

-- UPDATE name of ingredient where ingredientID = ?
UPDATE Ingredients
    SET name = :ingredientInput
    WHERE ingredientID = :ingredientidInput;

-- Update username of Creator where creatorID = ?
UPDATE Creators
    SET username = :usernameInput
    WHERE creatorID = :creatoridInput;

-- Update password of Password table where creatorID = ?
UPDATE Passwords
    SET password = :passwordInput
    WHERE creatorID =:creatoridInput;

-- No update query for RecipeComponents
------------------------------------------------

-- DELETE Operand

-- DELETES whole recipe row which matches the Recipe name
DELETE FROM Recipes WHERE name = :recipenameInput;

-- DELETES recipes created before the date.
DELETE FROM Recipes WHERE dateCreated < :dateInput;

-- DELETES recipes created by Creator 1.
DELETE FROM Recipes WHERE creatorID = :creatoridInput;

-- DELETES Ingredient where name = input
DELETE FROM Ingredients WHERE name = :ingredientInput;

-- DELETES credentials of Creators using creatorID and subquery attached to name of recipe
DELETE FROM Creators WHERE creatorID = (SELECT creatorID FROM Recipes WHERE name = :recipenameInput;);

-- DELETES creator from Creator table
DELETE FROM Creator WHERE creatorID = :creatoridInput;

-- DELETES username from Creator table
DELETE FROM Creator WHERE username = :usernameInput;

------------------------------------------------
