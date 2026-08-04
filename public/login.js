console.log("login.js loaded");

if (getToken()) {
    location.replace("index.html");
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    console.log("Submit intercepted");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        console.log("Calling login()...");

        await login(email, password);

        console.log("Login successful");

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});