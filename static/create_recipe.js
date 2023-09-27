
/**
 * Fills the select menu on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_menu = (data) =>{
    
    // create options dropdown list
    let options = document.createElement("div")
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

    // update the template
    let template_node = document.getElementById("hidden_ingredient_template").getElementsByClassName("ingredient_select")[0]
    
    template_node.innerHTML = options.innerHTML

    let select_elements = document.getElementsByClassName("ingredient_select")
    for(element of select_elements){
        // capture the current value to not overwrite
        let old_value = element.value
        
        // copy the inner html of the template and inject into this one
        element.innerHTML = template_node.innerHTML

        // restore the old value
        if(old_value in values){
            element.value = old_value
        }else{
            element.value = "" // clear value if ingredient disappears
        }
        
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
        .then(data => fill_menu(data))
        
    }

let add_ingredient_row = ()=>{
    let template_node = document.getElementById("hidden_ingredient_template")

    // create new node and remove the hidden attribute
    let new_node = template_node.cloneNode(true)
    new_node.hidden = false
    new_node.value = ""
    new_node.id = "" //clear ID

    document.getElementById("table_body").appendChild(new_node)

}

// perform ingredient data query immediately
get_data()

// start with a single ingredient row
add_ingredient_row()


/**
 * Adds another row to the table on click
 */
document.getElementById("add_ingredient").addEventListener("click", add_ingredient_row)

// refresh input list on button press
document.getElementById("refresh_ingredients").addEventListener("click", get_data)


// allow for POST/PUT to create/update recipe
let _page_create = true
const index_start = document.location.pathname.lastIndexOf("/")
const recipe_id = document.location.pathname.substring(index_start+1)
if(document.location.pathname.match("edit") != null){
    _page_create = false
}
document.getElementById("submit_btn").addEventListener("click", ()=>{
    let name = document.getElementById("name").value
    let description = document.getElementById("description").value
    let creatorID = parseInt(document.getElementById("creator_select").value)
    let private = parseInt(document.getElementById("private_select").value)

    let ingredients = Array()

    // loop over all ingredients on the page
    let ingredient_options = document.getElementsByClassName("ingredient_select")
    let ingredient_set = new Set()
    for(ingredient of ingredient_options){
        if (ingredient.value == "") {
            continue
        }

        // go up two levels to get the parent
        let row = ingredient.parentNode.parentNode

        // create the object for array
        let ingredient_item = Object()
        ingredient_item.id = ingredient.value
        try{
            ingredient_item.quantity = parseFloat(row.getElementsByClassName("ingredient_quantity")[0].value)
        }catch{
            ingredient_item.quantity = 0.0
        }
        ingredient_item.unit = row.getElementsByClassName("ingredient_unit")[0].value
        ingredient_item.required = parseInt(row.getElementsByClassName("required_select")[0].value)

        ingredients.push(ingredient_item)

        // prevent multiple rows of the same ingredient
        if (ingredient_set.has(ingredient_item.id)){
            alert("You must combine all rows of the same ingredient")
            return
        }else{
            ingredient_set.add(ingredient_item.id)
        }
    }

    let body = {
        id: !Number.isNaN(recipe_id) ? recipe_id: null,
        name: name,
        description: description,
        creatorID : !Number.isNaN(creatorID) ? creatorID : "",
        ingredients: ingredients,
        private: private
    }

    let url = "/recipe"
    let options = {
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(body)
    }

    
    // modify the method and URL depending on whether we are editing
    if (_page_create){
        options.method = "POST"
    }else{
        options.method = "PUT"
        url = `/recipe/${recipe_id}`
    }

    fetch(url, options)
    .then(response =>{
        if(response.status == 200){

            // go back to recipes on success
            window.location.assign("/recipes")
        }else{

            // attempt to get error message from response
            // else use default
            let err_msg = "An error occurred"

            // show error
            alert(err_msg)
        }
    })
    
})

/**
 * 
 * Fills the select menu on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_creator_menu = (data) =>{
    
    // create options dropdown list
    let options = document.createElement("div")
    let values = []

    // first create the empty option
    let option = document.createElement("option")
    option.value = ""
    option.innerHTML = "Select a Creator..."
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

    // update the dropdown
    let element = document.getElementById("creator_select")
    let element_value = element.value
    console.log(element_value)
    
    // copy the inner html of the template and inject into this one
    element.innerHTML = options.innerHTML
    element.value = element_value
        
}

/**
 * Requests ingredient list from server
 */
let get_creator_data = () =>{
        
        fetch("/creator", {
            method: "GET"
        })
        .then(response =>response.json())
        .then(data => {
            fill_creator_menu(data)
        })

}
get_creator_data()