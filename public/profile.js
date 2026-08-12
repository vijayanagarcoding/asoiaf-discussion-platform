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
const avatar =
    document.getElementById("profileAvatar");

avatar.src =
    `http://localhost:5000/uploads/${data.user.avatar}`;
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
const avatarInput =
    document.getElementById("avatarInput");

document
    .getElementById("changeAvatarBtn")
    .addEventListener("click", () => {

        avatarInput.click();

    });
    avatarInput.addEventListener("change", uploadAvatar);

async function uploadAvatar() {

    const file = avatarInput.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("avatar", file);

    try {

        const res = await fetch(`${API}/users/avatar`, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${getToken()}`

            },

            body: formData

        });

        const data = await res.json();

        if (!res.ok) {

            throw new Error(data.message);

        }

        document.getElementById("profileAvatar").src =
            `http://localhost:5000/uploads/${data.data.avatar}?t=${Date.now()}`;

        alert("Avatar updated!");

    } catch (error) {

        alert(error.message);

    }

}
    avatarInput.addEventListener("change", uploadAvatar);

async function uploadAvatar() {

    const file = avatarInput.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("avatar", file);

    try {

        const res = await fetch(`${API}/users/avatar`, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${getToken()}`

            },

            body: formData

        });

        const data = await res.json();

        if (!res.ok) {

            throw new Error(data.message);

        }

        document.getElementById("profileAvatar").src =
            `http://localhost:5000/uploads/${data.data.avatar}?t=${Date.now()}`;
const currentUser = getCurrentUser();

currentUser.avatar = data.data.avatar;

localStorage.setItem(
    "user",
    JSON.stringify(currentUser)
);
        alert("Avatar updated!");

    } catch (error) {

        alert(error.message);

    }

}
