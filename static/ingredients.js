
/**
 * Fills the table on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_table = (data) =>{

    // first clear the table
    let table_body = document.getElementById('table_body')
    table_body.innerHTML = ""
    
    for(row of data){
        let row_element = form_row([
            row.id,
            row.name, 
            row.recipeCount
        ])

        let ingredient_id = row.id

        //////////////////////////////////////////////////////////////////
        // add a link to the end of the end of the row to go to the recipe
        //////////////////////////////////////////////////////////////////
        let link_element = document.createElement("a")
        link_element.innerHTML = ("Go to Recipes")
        link_element.href = `/recipes?ingredient=${row.id}`

        let link_column = document.createElement("td")
        link_column.appendChild(link_element)
        row_element.appendChild(link_column)

        //////////////////////////////////////////////////////////////////
        // add a link to the end of the end of the row to update
        //////////////////////////////////////////////////////////////////
        let update_element = document.createElement("button")
        update_element.className = "btn btn-sm btn-warning"
        update_element.innerHTML = "Update Name"
        update_element.addEventListener("click", ()=>{

            let new_name = prompt("Enter new name")

            if (new_name.trim().length > 0){
                fetch(`/ingredient`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id": ingredient_id,
                        "name": new_name.trim()
                    })
                })
                .then(response=>{
                    // reload on success
                    if (response.status >= 200 && response.status <300){
                        location.reload()
                    }else{
                        alert("An error occurred")
                    }
                })
            }
            
        })

        let update_column = document.createElement("td")
        update_column.appendChild(update_element)
        row_element.appendChild(update_column)

        //////////////////////////////////////////////////////////////////
        // add a link to the end of the end of the row to delete
        //////////////////////////////////////////////////////////////////
        let delete_element = document.createElement("button")
        delete_element.className = "btn btn-sm btn-danger"
        delete_element.innerHTML = "Delete"
        delete_element.addEventListener("click", ()=>{
            fetch(`/ingredient?id=${ingredient_id}`, {
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
        table_body.appendChild(row_element)
    }
}

/**
 * Gets recipe data and calls fill_table
 */
let get_data = (filter) =>{
        let query_url = "?"

        if(filter.min){
            query_url += `min=${filter.min}`
        }else{
            query_url +="min=0"
        }

        if (filter.max){
            query_url += `&max=${filter.max}`
        }

        fetch(`/ingredient${query_url}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(response => { 
            fill_table(response)
        })
}

/**
 * Performs create ingredient
 */
let create_ingredient = (name) =>{
    let body = {
        "name": name
    }
    fetch('/ingredient',{
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
            document.getElementById("error_message").innerHTML = err_msg
        }
    })
}

// perform data query immediately
get_data({})

// allow new ingredient creation on this page
document.getElementById("new_ingredient_btn").addEventListener("click", ()=>{
    
    // validate the ingredient name
    let ingredient_name = document.getElementById("new_ingredient_name").value
    if(ingredient_name.trim().length == 0){
        document.getElementById("error_message").innerHTML = "Cannot submit empty name"
    }else{
        create_ingredient(ingredient_name)
    }
    
})

// allow filter by getting new data
document.getElementById("filter_btn").addEventListener("click", ()=>{
    let filter = {}
    let min = document.getElementById("filter_min").value
    let max = document.getElementById("filter_max").value

    filter.min = min != "" ? min : null
    filter.max = max != "" ? max : null

    get_data(filter)
    
})