
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
            row.recipe_count, 
        ])

        let creator_id = row.id
        //////////////////////////////////////////////////////////////////
        // add a link to row to go to the recipe
        //////////////////////////////////////////////////////////////////
        let link_element = document.createElement("a")
        link_element.innerHTML = ("Go to Recipes")
        link_element.href = `/recipes?user=${row.id}`

        let link_column = document.createElement("td")
        link_column.appendChild(link_element)
        row_element.appendChild(link_column)

        //////////////////////////////////////////////////////////////////
        // add a link to the row to update
        //////////////////////////////////////////////////////////////////
        let update_element = document.createElement("button")
        update_element.className = "btn btn-sm btn-warning"
        update_element.innerHTML = "Update User"
        update_element.addEventListener("click", ()=>{

            let new_name = window.prompt("Enter new username")

            if (new_name.trim().length > 0){
                fetch(`/creator`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id": creator_id,
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
        // add a link to the end of the row to delete
        //////////////////////////////////////////////////////////////////
        let delete_element = document.createElement("button")
        delete_element.className = "btn btn-sm btn-danger"
        delete_element.innerHTML = "Delete"
        delete_element.addEventListener("click", ()=>{
            fetch(`/creator?id=${creator_id}`, {
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



let query_creators = () =>{
    fetch("/creator", {
        method: "GET"
    })
    .then(response =>response.json())
    .then(data => {
        fill_table(data)
    })
}

query_creators()