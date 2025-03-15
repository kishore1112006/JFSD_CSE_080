function validateLogin() {
    let loginId = document.getElementById("loginId").value;
    let password = document.getElementById("password").value;

    if (loginId === "debuggers" && password === "5") {
        alert("Login Successful!");
        window.location.href = "2nd.html"; 
    } else {
        alert("Error: Invalid Login ID or Password!");
    }
}

