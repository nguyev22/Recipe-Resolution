// Const to be used across site to simulate data 
// or perform http request to get data
const SIMULATE_DATA = true;

let form_row = (data) =>{
    let row_element = document.createElement("tr")

    for(element of data){
        let cell_element = document.createElement("td")
        cell_element.innerHTML = element

        row_element.appendChild(cell_element)
    }

    return row_element
}