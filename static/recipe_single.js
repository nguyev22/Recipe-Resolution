
const index_start = document.location.pathname.lastIndexOf("/")
const recipe_id = document.location.pathname.substring(index_start+1)

/**
 * Fills the table on the page with the
 * received data
 * @param {*} data Array of Recipe data
 */
let fill_content = (data) =>{
    
    // fill in the easy fields
    document.getElementById("name").innerHTML = data.name
    document.getElementById("date").innerHTML = data.date.substring(5,16)
    document.getElementById("creator").innerHTML = data.creator ? data.creator : "<i>NULL</i>"
    document.getElementById("description").innerHTML = data.description.replaceAll("\n", "<br>") // replace all new lines with line break
    document.getElementById("private_public").innerHTML = data.private ? "Private" : "Public"



    // fill in ingredients
    for(row of data.ingredients){
        console.log(row)
        let row_element = form_row([
            row.name, 
            `${parseFloat(row.quantity).toFixed(4)} ${row.unit}`, // concatenate quantity and unit for concise view
            row.required ? "Required" : "Optional"
        ])

        // add a link to the end of the end of the row to go to the recipes w/ ingredient
        let link_element = document.createElement("a")
        link_element.innerHTML = ("Explore")
        link_element.href = `/recipes?ingredient=${row.id}`

        let link_column = document.createElement("td")
        link_column.appendChild(link_element)
        row_element.appendChild(link_column)

        // add the row to the table
        let table_body = document.getElementById('table_body')
        table_body.appendChild(row_element)

    }
}


if (SIMULATE_DATA){
    let query_recipes = () =>{
        fetch(`/recipe/detailed/${recipe_id}`, {
            method: "GET"
        })
        .then(response =>response.json())
        .then(data =>{
            // if creator id matches the current user

            fill_content(data)
        })
    }
    
    // first thing to do is to query for recipe data
    query_recipes()
}

// set up delete button if it is rendered
try{
    document.getElementById("delete_btn").addEventListener("click", ()=>{
        fetch(`/recipe/${recipe_id}`, {
            method: "DELETE"
        })
        .then(response => {
            window.location = "/recipes"
        })
    })
}catch{}