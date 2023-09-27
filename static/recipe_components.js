
/**
 * Fills the table on the page with the
 * received data
 * @param {*} data Array of Recipe data
 */
let fill_table = (data) =>{
    

    for(row of data){
        let rc_id = row.id
        let row_element = form_row([
            rc_id,
            row.recipe_name, 
            row.ingredient_name, 
            row.quantity, 
            row.unit,
            row.required ? "Required": "Optional"
        ])
        

        // add a link to the end of the end of the row to go to the recipe
        let link_element = document.createElement("a")
        link_element.innerHTML = ("View Recipe")
        link_element.href = `/recipe/${row.recipe_id}`

        let link_column = document.createElement("td")
        link_column.appendChild(link_element)
        row_element.appendChild(link_column)

        //////////////////////////////////////////////////////////////////
        // add a link to the end of the end of the row to delete
        //////////////////////////////////////////////////////////////////
        let delete_element = document.createElement("button")
        delete_element.className = "btn btn-sm btn-danger"
        delete_element.innerHTML = "Delete"
        delete_element.addEventListener("click", ()=>{
            fetch(`/recipe_component/${rc_id}`, {
                method: "DELETE"
            })
            .then(response=>{
                // reload on success
                if (response.status >= 200 && response.status <300){
                    location.reload()
                }else{
                    alert("An error occurred")
                }
            })
        })

        let delete_column = document.createElement("td")
        delete_column.appendChild(delete_element)
        row_element.appendChild(delete_column)


        // add the row to the table
        let table_body = document.getElementById('table_body')
        table_body.appendChild(row_element)
    }
}



let query_components = () =>{
    fetch("/recipe_component", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data =>{
        fill_table(data)
    })
}

// first thing to do is to query for recipe data
query_components()

/**
 * Fills the select menu on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_ingredients = (data) =>{
    
    // create options dropdown list
    let options = document.getElementById("ingredient_select")
    let values = []

    // first create the empty option
    let option = document.createElement("option")
    option.value = ""
    option.innerHTML = "Select an Ingredient..."
    options.appendChild(option)
    values.push(option.value)

    for(row of data){
        option = document.createElement("option")
        option.value= row.id,
        option.innerHTML = row.name
        
        // build arrays for option elements and values
        options.appendChild(option)
        values.push(option.value)
    }
    
}

/**
 * Fills the select menu on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_recipes = (data) =>{
    
    // create options dropdown list
    let options = document.getElementById("recipe_select")
    let values = []

    // first create the empty option
    let option = document.createElement("option")
    option.value = ""
    option.innerHTML = "Select a Recipe..."
    options.appendChild(option)
    values.push(option.value)

    for(row of data){
        option = document.createElement("option")
        option.value= row.id,
        option.innerHTML = row.name
        
        // build arrays for option elements and values
        options.appendChild(option)
        values.push(option.value)
    }
    
}

/**
 * Requests ingredient list from server
 */
let get_data = () =>{
    fetch("/ingredient", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => fill_ingredients(data))
    

    fetch("/recipe")
    .then(response=>response.json())
    .then(data => fill_recipes(data))

}

get_data()

// POST to create
document.getElementById("add_component").addEventListener("click", ()=>{
    let recipeId = parseInt(document.getElementById("recipe_select").value)
    let ingredientID = parseInt(document.getElementById("ingredient_select").value)
    let quantity = parseFloat(document.getElementById("add_qty").value)
    let unit = document.getElementById("add_unit").value
    let require = parseInt(document.getElementById("require_select").value)

    // validate
    if(Number.isNaN(recipeId) || Number.isNaN(ingredientID || Number.isNaN(quantity))){
        alert("You must select a recipe and an ingredient and specify a quantity")
        return
    }

    let body = {
        recipeID: recipeId,
        ingredientID: ingredientID,
        quantity: quantity,
        unit: unit,
        required: require
    }
    fetch("/recipe_component", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        if(response.status == 200){

            // refresh the page on success
            location.reload()
        }else{

            // attempt to get error message from response
            // else use default
            let err_msg = "An error occurred"

            // show error
            alert(err_msg)
        }
    })
})