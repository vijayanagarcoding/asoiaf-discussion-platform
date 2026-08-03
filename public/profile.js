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
    data.stats.threadCount;

document.getElementById("commentsCount").innerText =
    data.stats.commentCount;

document.getElementById("likesCount").innerText =
    data.stats.likesReceived;

document.getElementById("bookmarksCount").innerText =
    data.stats.bookmarkCount;

         const recentThreads =
            document.getElementById("recentThreads");

        recentThreads.innerHTML = "";

        data.recentThreads.forEach(thread => {

            const div = document.createElement("div");

            div.className = "item";

            div.innerHTML = `

    <span class="category ${thread.category.toLowerCase()}">
        ${thread.category}
    </span>

    <h3>${thread.title}</h3>

    <p>❤️ ${thread.likes.length} Likes</p>

    <p>📅 ${new Date(thread.createdAt).toLocaleDateString()}</p>

`;
div.style.cursor = "pointer";

div.onclick = () => {

    window.location.href =
        `index.html?thread=${thread._id}`;

};

            recentThreads.appendChild(div);

        }); 

    } catch (error) {

        console.error(error);

    }

}