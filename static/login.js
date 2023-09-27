/**
 * Creates a username and password by POSTing to server
 */
let createUser = (user, password) => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          window.location = "/creators";
        } else if (response.status === 404) {
          document.getElementById("error_message").innerHTML =
            "User already exists. Please choose a different username";
        } else {
          document.getElementById("error_message").innerHTML =
            "An error occurred. Check for duplicate username or invalid password";
        }
      });
  };

document.getElementById("create_btn").addEventListener("click", () => {
    // validate the name & password
    let user = document.getElementById("user").value;
    let password = document.getElementById("password").value;
    if (user.trim().length == 0 || password.trim().length == 0) {
      document.getElementById("error_message").innerHTML = "Cannot submit empty field";
    } else {
      createUser(user, password);
    }
  });

