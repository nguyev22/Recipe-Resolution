
/**
 * Fills the table on the page with the
 * received data
 * @param {*} data Array of Recipe data
 */
let fill_table = (data) =>{
    

    for(row of data){
        let row_element = form_row([
            row.id,
            row.name, 
            row.ingredient_count, 
            row.creator !== null ? row.creator : "<i>NULL</i>", 
            row.private ? "Private" : "Public", 
            row.date.substring(5,16)
        ])

        // add a link to the end of the end of the row to go to the recipe
        let link_element = document.createElement("a")
        link_element.innerHTML = ("View Recipe")
        link_element.href = `/recipe/${row.id}`

        let link_column = document.createElement("td")
        link_column.appendChild(link_element)
        row_element.appendChild(link_column)

        // add the row to the table
        let table_body = document.getElementById('table_body')
        table_body.appendChild(row_element)

    }
}



    let query_recipes = () =>{

        fetch(`/recipe${window.location.search}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data =>{
            fill_table(data)
        })
    }
    
    // first thing to do is to query for recipe data
    query_recipes()


// add event listener to Create Button
document.getElementById("create_recipe_btn").addEventListener("click", ()=>{

    // if user does not exist, go to login page
    if(false){
        // TODO implement user
        window.location.pathname = "/login"
    }else{
        window.location.pathname = "/recipe/create"
    }

})


/**
 * 
 * SEARCH INGREDIENTS
 * 
 */

/**
 * 
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

    // update the dropdown
    let element = document.getElementById("ingredient_select")
    
    // copy the inner html of the template and inject into this one
    element.innerHTML = options.innerHTML
        
}

/**
 * Requests ingredient list from server
 */
let get_ingredient_data = () =>{
        
        fetch("/ingredient", {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => fill_menu(data))
        
        // perform query and then fill table
        
}
get_ingredient_data()

// on click refresh page and search for recipes w/ ingredients
document.getElementById("search_ingredient").addEventListener("click", ()=>{
    let ingredient_id = document.getElementById("ingredient_select").value
    
    let link = document.createElement("a")
    link.href = `/recipes?ingredient=${ingredient_id}`
    link.hidden = true
    document.childNodes[0].appendChild(link)
    link.click()

    
})

/**
 * 
 * SEARCH CREATORS
 * 
 */

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
    
    // copy the inner html of the template and inject into this one
    element.innerHTML = options.innerHTML
        
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

// on click refresh page and search for recipes w/ ingredients
document.getElementById("search_creator").addEventListener("click", ()=>{
    let ingredient_id = document.getElementById("creator_select").value
    
    let link = document.createElement("a")
    link.href = `/recipes?user=${ingredient_id}`
    link.hidden = true
    document.childNodes[0].appendChild(link)
    link.click()

    
})