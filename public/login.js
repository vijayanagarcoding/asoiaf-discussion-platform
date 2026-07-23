if (getToken()) {
    location.replace("index.html")
}
document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault()

        const email =
            document.getElementById("email").value.trim()

        const password =
            document.getElementById("password").value

        try {

            await login(email, password)

            window.location.href = "index.html"

        } catch (error) {

            alert(error.message)

        }

    })