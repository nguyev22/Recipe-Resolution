
/**
 * Fills the table on the page with the
 * received data
 * @param {*} data Array of Ingredient data
 */
let fill_table = (data) =>{

    for(row of data){
        let row_element = form_row([
            row.id, 
            row.creator_name, 
            row.password
        ])

        let creator_id = row.id

        //////////////////////////////////////////////////////////////////
        // add a link to the row to update
        //////////////////////////////////////////////////////////////////
        let update_element = document.createElement("button")
        update_element.className = "btn btn-sm btn-warning"
        update_element.innerHTML = "Update Password"
        update_element.addEventListener("click", ()=>{

            let new_password = window.prompt("Enter new password")

            if (new_password.trim().length > 0){
                fetch(`/password`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id": creator_id,
                        "password": new_password.trim()
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

        let table_body = document.getElementById('table_body')
        table_body.appendChild(row_element)
    }
}

/**
 * Gets password data and calls fill_table
 */
let query_passwords = () => {
    fetch("/password", {
        method: "GET"
    })
    .then(response => response.json())
    .then(response => { 
        fill_table(response)
    })
}


// perform data query immediately
query_passwords();
