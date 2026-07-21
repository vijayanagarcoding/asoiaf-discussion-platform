const api = "http://localhost:5000/api"
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

            loadThreads(ch._id)
        }

        container.appendChild(div)

    })
}
async function loadChapters() {
    

    try {
        console.log("loadChapters called")

        const booksRes = await fetch(`${api}/books`)
        console.log("booksRes:", booksRes)

        const books = await booksRes.json()
        console.log("books:", books)

        const bookId = books[0]._id
        console.log("bookId:", bookId)

        const res = await fetch(`${api}/books/${bookId}/chapters`)
        console.log("chapters response:", res)

        const chapters = await res.json()
    

        allChapters = chapters

        console.log("chapters:", chapters)

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

    const container = document.getElementById("threads")
    container.innerHTML = "<h2>Threads</h2>"

    if (threads.length === 0) {
        container.innerHTML = `
            <h2>Threads</h2>
            <p>No discussions yet.</p>
            <p>Start the first discussion!</p>
        `
        return
    }

    threads.forEach(th => {

        const div = document.createElement("div")
        div.className = "item"

        const date = formatTime(th.createdAt)
const commentText =
    th.commentCount === 1
        ? "1 Comment"
        : `${th.commentCount} Comments`
        div.innerHTML = `
    <h3>${th.title}</h3>

    <p>👤 Anonymous</p>

    <p>💬 ${th.commentCount} Comments</p>

    <p>📅 ${date}</p>
`
        

        div.onclick = () => {

            document.querySelectorAll("#threads .item").forEach(item => {
                item.classList.remove("selected")
            })

            div.classList.add("selected")

            document.getElementById("selectedThread").style.display = "block"

            document.getElementById("selectedThreadTitle").innerText = th.title

            document.getElementById("selectedThreadContent").innerText = th.content

            loadComments(th._id)
        }

        container.appendChild(div)
    })
}
async function loadThreads(chapterId) {

    window.currentChapterId = chapterId
document.getElementById("threadSearch").value = ""
    document.getElementById("createThread").style.display = "block"

    try {

        console.log("Clicked chapter:", chapterId)

        const res = await fetch(`${api}/chapters/${chapterId}/threads`)
        console.log("Response:", res)

        const threads = await res.json()
        console.log("Threads:", threads)

        allThreads = threads

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
            <h2>Comments</h2>
            <p>No comments found.</p>
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

        div.innerHTML = `
            <h4>Anonymous</h4>
            <p>${c.content}</p>
            <small>${date}</small>
        `

        container.appendChild(div)
    })
}

async function loadComments(threadId) {

    window.currentThreadId = threadId

    document.getElementById("createComment").style.display = "block"

    try {

        console.log("Clicked thread:", threadId)

        const res = await fetch(`${api}/threads/${threadId}/comments`)
        console.log("Comments response:", res)

        const comments = await res.json()
        allComments = comments
        console.log("Comments:", comments)

        renderComments(comments)
    } catch (error) {
        console.error("Comments ERROR:", error)
    }
}

async function createThread() {

    const title = document.getElementById("threadTitle").value.trim()
    const content = document.getElementById("threadContent").value.trim()

    if (!window.currentChapterId) {
        alert("Please select a chapter first.")
        return
    }

    if (!title || !content) {
        alert("Please enter both title and content.")
        return
    }

    const res = await fetch(`${api}/chapters/${window.currentChapterId}/threads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            content
        })
    })

    if (!res.ok) {
        console.error(await res.text())
        alert("Failed to create thread.")
        return
    }

    document.getElementById("threadTitle").value = ""
    document.getElementById("threadContent").value = ""

    await loadThreads(window.currentChapterId)
}

async function createComment() {

    const content = document.getElementById("commentContent").value.trim()

    if (!window.currentThreadId) {
        alert("Please select a thread first.")
        return
    }

    if (!content) {
        alert("Please enter a comment.")
        return
    }

    const res = await fetch(`${api}/threads/${window.currentThreadId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content
        })
    })

    if (!res.ok) {
        console.error(await res.text())
        alert("Failed to create comment.")
        return
    }

    document.getElementById("commentContent").value = ""

    await loadComments(window.currentThreadId)
}

loadChapters()

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