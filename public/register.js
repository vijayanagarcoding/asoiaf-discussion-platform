if (getToken()) {
    location.replace("index.html")
}
document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault()

        const username =
            document.getElementById("username").value.trim()

        const email =
            document.getElementById("email").value.trim()

        const password =
            document.getElementById("password").value

        try {

            await register(username, email, password)

            window.location.href = "index.html"

        } catch (error) {

            alert(error.message)

        }

    })