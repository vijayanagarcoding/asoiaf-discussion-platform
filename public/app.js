if (!getToken()) {
    window.location.replace("login.html")
}
const api = "http://localhost:5000/api"
function authHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }

}
const currentUser = getCurrentUser()
if (!currentUser) {

    document.getElementById("createThread").style.display = "none"

    document.getElementById("createComment").style.display = "none"

} else {

    document.getElementById("createThread").style.display = "block"

}
if (currentUser) {

    document.getElementById("currentUser").innerText =
        `Welcome, ${currentUser.username} 👋`

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout)

}

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout)
let allChapters = []
let allThreads = []
let allComments = []
function renderChapters(chapters) {

    const container = document.getElementById("chapters")
    container.innerHTML = "<h2>Chapters</h2>"

    chapters.forEach(ch => {

        const div = document.createElement("div")
        div.className = "item"
        div.innerText = ch.order + ". " + ch.title

        div.onclick = () => {

            document.querySelectorAll("#chapters .item").forEach(item => {
                item.classList.remove("selected")
            })

            div.classList.add("selected")

           window.currentChapterTitle = ch.title

loadThreads(ch._id)
        }

        container.appendChild(div)

    })
}
async function loadBooks() {

    try {

        const res = await fetch(`${api}/books`);

        const books = await res.json();

        renderBooks(books);

    } catch (error) {

        console.error(error);

    }

}
function renderBooks(books) {

    const container = document.getElementById("books");

    container.innerHTML = `
        <h2>Books</h2>
    `;

    books.forEach(book => {

        const div = document.createElement("div");

        div.className = "item";

       div.innerHTML = `
    <img
        src="${book.coverImage}"
        class="book-cover"
        alt="${book.title}">

    <h2>${book.title}</h2>

    <p>${book.author}</p>

    <button class="enter-btn">
        Enter Discussion
    </button>
`;

        div.onclick = () => {

            loadChapters(book);

        };

        container.appendChild(div);

    });

}
async function loadChapters(book)  {
    const container = document.getElementById("chapters")

container.innerHTML = `
    <h2>Chapters</h2>

    <div class="loading">

        <div class="spinner"></div>

        <span>Loading chapters...</span>

    </div>
`

    try {
       

        
        

        document.getElementById("bookTitle").innerText = book.title;

document.getElementById("bookAuthor").innerText = book.author;

const bookId = book._id;

        const res = await fetch(`${api}/books/${bookId}/chapters`)
        

        const chapters = await res.json()
    

        allChapters = chapters
        document.getElementById("chapterCount").innerText = chapters.length
document.getElementById("bookStats").innerText = "Epic Fantasy"
        

        renderChapters(chapters)

    } catch (err) {
        console.error("loadChapters ERROR:", err)
    }
}
function formatTime(dateString) {

    const now = new Date()
    const date = new Date(dateString)

    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return "Just now"

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`
    }

    const days = Math.floor(hours / 24)
    if (days === 1) return "Yesterday"

    if (days < 30) {
        return `${days} days ago`
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}
function renderThreads(threads) {
threads.sort((a, b) => {

    if (a.pinned === b.pinned) return 0;

    return a.pinned ? -1 : 1;

})
    const container = document.getElementById("threads")
    container.innerHTML = `
    <h2>
        Threads (${threads.length})
    </h2>
`

    if (threads.length === 0) {
    container.innerHTML = `
        <h2>Threads</h2>

        <div class="empty-state">

            <h3>💬 No discussions yet</h3>

            <p>
                Be the first person to start a discussion for this chapter.
            </p>

        </div>
    `
    return
}
const currentUser = getCurrentUser();
    threads.forEach(th => {

        const div = document.createElement("div")
        div.className = "item"

        const date = formatTime(th.createdAt)
const commentText =
    th.commentCount === 1
        ? "1 Comment"
        : `${th.commentCount} Comments`
        div.innerHTML = `
    <span class="category ${th.category.toLowerCase()}">
        ${th.category}
    </span>

    <h3>
    ${th.pinned ? "📌" : ""}
    ${th.title}
</h3>

    <span
    class="profile-link"
    onclick="event.stopPropagation(); openProfile('${th.user._id}')"

    ${th.user?.username || "Anonymous"}

</span>

    <p>❤️ ${th.likes?.length || 0} Likes</p>

    <button
    class="like-btn"
    onclick="event.stopPropagation(); toggleLike('${th._id}')">

    ❤️ Like

</button>
<button
    class="bookmark-btn"
    onclick="event.stopPropagation(); toggleBookmark('${th._id}')">

    ⭐ Bookmark

</button>
<p>💬 ${th.commentCount} Comments</p>

    <p>📅 ${date}</p>
    ${currentUser && th.user &&
currentUser.id === th.user._id
? `
    <button
        class="edit-thread-btn"
        onclick="event.stopPropagation(); editThread('${th._id}')">

        ✏️ Edit

    </button>

    <button
        class="delete-thread-btn"
        onclick="event.stopPropagation(); deleteThread('${th._id}')">

        🗑️ Delete

    </button>
`
: ""}

`

        

        div.onclick = () => {

            document.querySelectorAll("#threads .item").forEach(item => {
                item.classList.remove("selected")
            })

            div.classList.add("selected")
document.getElementById("welcome").style.display = "none"
document.getElementById("breadcrumb").innerHTML = `
    <span>A Storm of Swords</span>
    &nbsp;›&nbsp;
    <span>${window.currentChapterTitle}</span>
    &nbsp;›&nbsp;
    ${th.title}
`
            document.getElementById("selectedThread").style.display = "block"
const discussion = document.getElementById("selectedThread")

discussion.classList.remove("fade-in")

void discussion.offsetWidth

discussion.classList.add("fade-in")
            document.getElementById("selectedThreadTitle").innerText = th.title
             const time = formatTime(th.createdAt)

document.getElementById("selectedThreadMeta").innerHTML = `
    <span class="thread-author">
        <img
            src="images/default-avatar.png"
            class="avatar">
        ${th.user?.username || "Anonymous"}
    </span>
    &nbsp;&nbsp; • &nbsp;&nbsp;
    🕒 ${time}
`
  
            document.getElementById("selectedThreadContent").innerText = th.content

            loadComments(th._id)
            document.getElementById("selectedThread")
    .scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
        }

        container.appendChild(div)
    })
}
async function loadThreads(chapterId) {

    window.currentChapterId = chapterId
document.getElementById("threadSearch").value = ""
    document.getElementById("createThread").style.display = "block"
const container = document.getElementById("threads")

container.innerHTML = `
    <h2>Threads</h2>

    <div class="loading">

        <div class="spinner"></div>

        <span>Loading discussions...</span>

    </div>
`

    try {

        

        const res = await fetch(`${api}/chapters/${chapterId}/threads`)
       

        const threads = await res.json()
       

        allThreads = threads
document.getElementById("threadCount").innerText = threads.length
        renderThreads(threads)

    } catch (error) {
        console.error("ERROR:", error)
    }
}


function renderComments(comments) {

    const container = document.getElementById("comments")
    container.innerHTML = "<h2>Comments</h2>"

    if (comments.length === 0) {
    container.innerHTML = `
    <h2>
        Comments (${comments.length})
    </h2>

        <div class="empty-state">

            <h3>📝 No comments yet</h3>

            <p>
                Start the conversation by posting the first comment.
            </p>

        </div>
    `
    return
}

    comments.forEach(c => {

        const div = document.createElement("div")
        div.className = "item"

        const date = new Date(c.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
const currentUser = getCurrentUser();
let commentActions = "";

if (
    currentUser &&
    c.user &&
    currentUser.id === c.user._id
) {

    commentActions = `
        <button
            class="edit-comment-btn"
            onclick="event.stopPropagation(); editComment('${c._id}')">

            ✏️ Edit

        </button>

        <button
            class="delete-comment-btn"
            onclick="event.stopPropagation(); deleteComment('${c._id}')">

            🗑️ Delete

        </button>
    `;
}
        div.innerHTML = `
    <h4 class="comment-author">

        <img
            src="images/default-avatar.png"
            class="avatar">

        ${c.user?.username || "Anonymous"}

    </h4>

    <p>${c.content}</p>

    <small>${date}</small>
    ${commentActions}
`

        container.appendChild(div)
    })
}

async function loadComments(threadId) {

    window.currentThreadId = threadId

    if (currentUser) {
    document.getElementById("createComment").style.display = "block"
}

    const container = document.getElementById("comments")

container.innerHTML = `
    <h2>Comments</h2>

    <div class="loading">

        <div class="spinner"></div>

        <span>Loading comments...</span>

    </div>
`

    try {

       

        const res = await fetch(`${api}/threads/${threadId}/comments`)
        

        const comments = await res.json()
        allComments = comments
        document.getElementById("commentCount").innerText = comments.length
       

        renderComments(comments)
    } catch (error) {
        console.error("Comments ERROR:", error)
    }
} 

async function createThread() {
const button = document.getElementById("createThreadBtn")

button.disabled = true
button.innerText = "Creating..."
    const title = document.getElementById("threadTitle").value.trim()
    const content = document.getElementById("threadContent").value.trim()
    const category = document.getElementById("threadCategory").value

    if (!window.currentChapterId) {
    showToast("⚠️ Please select a chapter first.")
    return
}

    if (!title || !content) {
        showToast("⚠️ Please enter both title and content.")
        return
    }

    try {

        const res = await fetch(`${api}/chapters/${window.currentChapterId}/threads`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
                title,
                content,
                category
            })
        })

        if (!res.ok) {
            throw new Error(await res.text())
        }

        showToast("✅ Thread created successfully!")

        document.getElementById("threadTitle").value = ""
        document.getElementById("threadContent").value = ""

        await loadThreads(window.currentChapterId)
button.disabled = false
button.innerText = "Create Thread"
    } catch (error) {

        console.error(error)

        showToast("❌ Failed to create thread.")
        button.disabled = false
button.innerText = "Create Thread"

    }

}
async function createComment() {

    const button = document.getElementById("createCommentBtn")

    const content = document
        .getElementById("commentContent")
        .value
        .trim()

    if (!window.currentThreadId) {
        showToast("⚠️ Please select a thread first.")
        return
    }

    if (!content) {
        showToast("⚠️ Please enter a comment.")
        return
    }

    button.disabled = true
    button.innerText = "Posting..."

    try {

        const res = await fetch(
            `${api}/threads/${window.currentThreadId}/comments`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify({
                    content
                })
            }
        )

        if (!res.ok) {
            throw new Error(await res.text())
        }

        showToast("💬 Comment posted!")

        document.getElementById("commentContent").value = ""

        await loadComments(window.currentThreadId)

    } catch (error) {

        console.error(error)

        showToast("❌ Failed to post comment.")

    } finally {

        button.disabled = false

        button.innerText = "Post Comment"

    }

}
document.addEventListener("DOMContentLoaded", () => {

    loadBooks();

});

document
    .getElementById("createThreadBtn")
    .addEventListener("click", createThread)

document
    .getElementById("createCommentBtn")
    .addEventListener("click", createComment)
    document
    .getElementById("chapterSearch")
    .addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim()

        const filtered = allChapters.filter(ch =>
            ch.title.toLowerCase().includes(searchText)
        )

        renderChapters(filtered)
    })
    document
    .getElementById("threadSearch")
    .addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim()

        const filtered = allThreads.filter(thread =>
            thread.title.toLowerCase().includes(searchText)
        )

        renderThreads(filtered)
    })
    document
    .getElementById("commentSearch")
    .addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim()

        const filtered = allComments.filter(comment =>
            comment.content.toLowerCase().includes(searchText)
        )

        renderComments(filtered)
    })
    const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)]

document.getElementById("quoteText").innerText =
    `"${randomQuote.quote}"`

document.getElementById("quoteCharacter").innerText =
    `— ${randomQuote.character}`
    document
.getElementById("threadSort")
.addEventListener("change", function(){

    let sorted=[...allThreads];

    switch(this.value){

        case "oldest":
            sorted.sort((a,b)=>
                new Date(a.createdAt)-new Date(b.createdAt));
            break;

        case "comments":
            sorted.sort((a,b)=>
                b.commentCount-a.commentCount);
            break;

        case "title":
            sorted.sort((a,b)=>
                a.title.localeCompare(b.title));
            break;

        default:
            sorted.sort((a,b)=>
                new Date(b.createdAt)-new Date(a.createdAt));
    }

    renderThreads(sorted);

});
function showToast(message){

    const toast = document.getElementById("toast")

    toast.innerText = message

    toast.classList.add("show")

    setTimeout(()=>{

        toast.classList.remove("show")

    },3000)

}

    function confirmAction(message) {

    return confirm(message)

}
const user = getCurrentUser()

if (user) {
    document.getElementById("currentUser").innerText = user.username
}

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout)
async function editThread(threadId) {

    const thread = allThreads.find(t => t._id === threadId);

    if (!thread) return;

    const newTitle = prompt("Edit title:", thread.title);

    if (newTitle === null) return;

    const newContent = prompt("Edit content:", thread.content);

    if (newContent === null) return;

    try {

        const res = await fetch(`${api}/threads/${threadId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },

            body: JSON.stringify({

                title: newTitle,

                content: newContent

            })

        });

        if (!res.ok) {

            throw new Error(await res.text());

        }

        showToast("✅ Thread updated!");

        await loadThreads(window.currentChapterId);

    } catch (err) {

        console.error(err);

        showToast("❌ Failed to update thread.");

    }

}
async function deleteThread(threadId) {

    if (!confirm("Delete this thread permanently?")) {
        return;
    }

    try {

        const res = await fetch(`${api}/threads/${threadId}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${getToken()}`
            }

        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("🗑️ Thread deleted!");

        await loadThreads(window.currentChapterId);

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to delete thread.");

    }

}
async function editComment(commentId) {

    const comment = allComments.find(c => c._id === commentId);

    if (!comment) return;

    const newContent = prompt(
        "Edit your comment:",
        comment.content
    );

    if (newContent === null) return;

    try {

        const res = await fetch(
            `${api}/comments/${commentId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },

                body: JSON.stringify({
                    content: newContent
                })
            }
        );

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("✅ Comment updated!");

        await loadComments(window.currentThreadId);

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to update comment.");

    }

}

async function deleteComment(commentId) {

    if (!confirm("Delete this comment permanently?")) {
        return;
    }

    try {

        const res = await fetch(
            `${api}/comments/${commentId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            }
        );

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("🗑️ Comment deleted!");

        await loadComments(window.currentThreadId);

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to delete comment.");

    }

}
const cover = document.getElementById("bookCover");

cover.addEventListener("mousemove", (e) => {

    const rect = cover.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 20;
    const rotateX = -(y / rect.height - 0.5) * 20;

    cover.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         scale(1.05)`;

});

cover.addEventListener("mouseleave", () => {

    cover.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

});
async function toggleLike(threadId) {

    try {

        const res = await fetch(
            `${api}/threads/${threadId}/like`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            }
        );

        if (!res.ok) {
            throw new Error(await res.text());
        }

        await loadThreads(window.currentChapterId);

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to like thread.");

    }

}
async function toggleBookmark(threadId) {

    try {

        const res = await fetch(
            `${api}/threads/${threadId}/bookmark`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${getToken()}`
                }
            }
        );

        if (!res.ok) {
            throw new Error(await res.text());
        }

        showToast("⭐ Bookmark updated!");

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to update bookmark.");

    }

}
document
    .getElementById("viewBookmarksBtn")
    .onclick = loadBookmarks;
    async function loadBookmarks() {

    try {

        const res = await fetch(
            `${api}/users/bookmarks`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            }
        );

        const threads = await res.json();

        renderThreads(threads);

        showToast("⭐ Showing bookmarked threads");

    } catch (error) {

        console.error(error);

    }

}

document
    .getElementById("currentUserInfo")
    .onclick = () => {

        window.location.href = "profile.html";

    };
    function openProfile(userId) {

    window.location.href =
        `profile.html?id=${userId}`;

}
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {

        document.body.classList.add("light");
        themeBtn.innerText = "☀️";

    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {

            localStorage.setItem("theme", "light");
            themeBtn.innerText = "☀️";

        } else {

            localStorage.setItem("theme", "dark");
            themeBtn.innerText = "🌙";

        }

    });

}