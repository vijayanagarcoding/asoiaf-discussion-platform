const PROFILE_API = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

});

async function loadProfile() {

    try {

        const res = await fetch(`${API}/users/profile`, {

            headers: {
                Authorization: `Bearer ${getToken()}`
            }

        });

        const data = await res.json();

        document.getElementById("profileUsername").innerText =
            data.user.username;

        document.getElementById("profileEmail").innerText =
            data.user.email;

        document.getElementById("profileJoined").innerText =
            `Joined ${new Date(data.user.createdAt).toLocaleDateString()}`;

        document.getElementById("threadsCount").innerText =
            data.threadsCreated;

        document.getElementById("commentsCount").innerText =
            data.commentsPosted;

        document.getElementById("likesCount").innerText =
            data.likesReceived;

        document.getElementById("bookmarksCount").innerText =
            data.bookmarks;

        const recentThreads =
            document.getElementById("recentThreads");

        recentThreads.innerHTML = "";

        data.recentThreads.forEach(thread => {

            const div = document.createElement("div");

            div.className = "item";

            div.innerHTML = `

                <h3>${thread.title}</h3>

                <p>${thread.category}</p>

            `;

            recentThreads.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }

}