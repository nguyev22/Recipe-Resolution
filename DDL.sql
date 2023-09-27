-- Project Title: Recipe Resolution
-- Team Members: Christopher Nguyen, Vi Nguyen
-- Team Number: 30

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- //Recipes Table//
CREATE OR REPLACE TABLE `Recipes` (
    `recipeID` int AUTO_INCREMENT UNIQUE NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` varchar(255),
    `creatorID` int,
    `dateCreated` DATE NOT NULL,
    `private` BIT,
    PRIMARY KEY (recipeID),
    FOREIGN KEY (creatorID) REFERENCES Creators(creatorID) ON DELETE SET NULL
);

-- //RecipeComponents Table//
CREATE OR REPLACE TABLE `RecipeComponents` (
    `componentID` int AUTO_INCREMENT UNIQUE NOT NULL,
    `recipeID` int,
    `ingredientID` int,
    `quantity` decimal(10,5) NOT NULL,
    `unit` varchar(255) NOT NULL,
    `required` BIT,
    PRIMARY KEY (componentID),
    UNIQUE (recipeID, ingredientID),
    FOREIGN KEY (recipeID) REFERENCES Recipes(recipeID) ON DELETE CASCADE,
    FOREIGN KEY (ingredientID) REFERENCES Ingredients(ingredientID) ON DELETE CASCADE
);

-- //Creators Table//
CREATE OR REPLACE TABLE `Creators` (
    `creatorID` int AUTO_INCREMENT UNIQUE NOT NULL,
    `username` varchar(255) UNIQUE NOT NULL,
    PRIMARY KEY (creatorID)
);

-- //Ingredients Table//
CREATE OR REPLACE TABLE `Ingredients` (
    `ingredientID` int AUTO_INCREMENT UNIQUE NOT NULL,
    `name` varchar(255) UNIQUE NOT NULL,
    PRIMARY KEY (ingredientID)
);

-- //Passwords Table//
CREATE OR REPLACE TABLE `Passwords` (
    `creatorID` int UNIQUE,
    `password` varchar(255) NOT NULL,
    FOREIGN KEY (creatorID) REFERENCES Creators(creatorID)
    ON DELETE CASCADE
);

-- // Insert Data into Recipes Table//
INSERT INTO Recipes (name, description, creatorID, dateCreated, private) VALUES
('Lasagna', "Grandma's Italian recipe with mozarella cheese", 1, '2020-03-19', 0),
('Mac and Cheese', '3 Cheese mac with chicken', 2, '2022-11-17', 0),
('Meatloaf', "Uncle Jim's Amish Meatloaf", 3, '2017-06-06', 0),
('Soy Sauce Chicken', 'Sous Vide marinated chicken', 4, '2019-09-25', 0),
('Mac & Cheese', 'Classic comfort food', 3, '2019-02-22', 1);

-- // Insert Data into RecipeComponents Table//
INSERT INTO RecipeComponents (recipeID, ingredientID, quantity, unit, required) VALUES
(1, 1, 300, 'grams', 1),
(2, 2, 1, 'cup', 1),
(3, 3, 800, 'grams', 1),
(4, 4, 2, 'lbs', 1),
(1, 2, 500, 'grams', 1),
(3, 5, 250, 'grams', 1),
(4, 6, 150, 'mLs', 1),
(5, 2, 6, 'oz', 1),
(5, 7, 0.5, 'cup', 1),
(5, 8, 1, 'cup', 1);



-- // Insert Data into Creators Table//
INSERT INTO Creators (username) VALUES
('JohnDoe123'),
('KimOnAWhim789'),
('WillCook4Will99'),
('JamAndJosh4141');

-- // Insert Data into Ingredients Table//
INSERT INTO Ingredients (name) VALUES
('Tomatos'),
('Mozarella Cheese'),
('Ground Beef'),
('Chicken'),
('Ketchup'),
('Soy Sauce'),
('Milk'),
('Macaroni');

-- // Insert Data into Passwords Table//
INSERT INTO Passwords (creatorID, password) VALUES
(1, '123Password'),
(2, 'Password456'),
(3, 'amishparadise123'),
(4, 'judgejosh4food456');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;


