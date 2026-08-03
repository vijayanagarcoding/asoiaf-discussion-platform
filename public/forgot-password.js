const api = "http://localhost:5000/api";

document
    .getElementById("sendResetBtn")
    .addEventListener("click", sendResetEmail);

async function sendResetEmail() {

    const email =
        document.getElementById("email").value;

    try {

        const res = await fetch(
    `${api}/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ email })
            }
        );

        const data = await res.json();

        alert(data.message);

    } catch (error) {

        console.error(error);

    }

}