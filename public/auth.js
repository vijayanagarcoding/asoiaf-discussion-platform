const API = "http://localhost:5000/api"

function saveSession(token, user) {

    localStorage.setItem("token", token)

    localStorage.setItem("user", JSON.stringify(user))

}

function getToken() {

    return localStorage.getItem("token")

}

function getCurrentUser() {

    const user = localStorage.getItem("user")

    return user ? JSON.parse(user) : null

}

function logout() {

    localStorage.removeItem("token")

    localStorage.removeItem("user")

    window.location.replace("login.html")

}
async function register(username, email, password) {

    const res = await fetch(`${API}/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            email,
            password
        })

    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    saveSession(data.data.token, data.data.user)

    return data

}
async function login(email, password) {

    const res = await fetch(`${API}/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message)
    }

    saveSession(data.data.token, data.data.user)

    return data

}