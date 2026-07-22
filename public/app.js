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

           window.currentChapterTitle = ch.title

loadThreads(ch._id)
        }

        container.appendChild(div)

    })
}
async function loadChapters() {
    const container = document.getElementById("chapters")

container.innerHTML = `
    <h2>Chapters</h2>

    <div class="loading">

        <div class="spinner"></div>

        <span>Loading chapters...</span>

    </div>
`

    try {
       

        const booksRes = await fetch(`${api}/books`)
        

        const books = await booksRes.json()
        const book = books[0]

document.getElementById("bookTitle").innerText = book.title
document.getElementById("bookAuthor").innerText = book.author
        

        const bookId = books[0]._id
       

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

    <p class="thread-author">
        <img
            src="images/default-avatar.png"
            class="avatar">

        Anonymous
    </p>

    <p>💬 ${th.commentCount} Comments</p>

    <p>📅 ${date}</p>
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
        Anonymous
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

        div.innerHTML = `
            <h4 class="comment-author">

    <img
        src="images/default-avatar.png"
        class="avatar">

    Anonymous

</h4>
            <p>${c.content}</p>
            <small>${date}</small>
        `

        container.appendChild(div)
    })
}

async function loadComments(threadId) {

    window.currentThreadId = threadId

    document.getElementById("createComment").style.display = "block"
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
            headers: {
                "Content-Type": "application/json"
            },
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

button.disabled = true
button.innerText = "Posting..."
    const content = document.getElementById("commentContent").value.trim()

    if (!window.currentThreadId) {
        showToast("⚠️ Please select a thread first.")
        return
    }

    if (!content) {
        showToast("⚠️ Please enter a comment.")
        return
    }

    try {

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
            throw new Error(await res.text())
        }

        showToast("💬 Comment posted!")
button.disabled = false
button.innerText = "Post Comment"
        document.getElementById("commentContent").value = ""

        await loadComments(window.currentThreadId)

    } catch (error) {

        console.error(error)

        showToast("❌ Failed to post comment.")
        button.disabled = false
button.innerText = "Post Comment"

    }

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
document
    .getElementById("createThreadBtn")
    .addEventListener("click", createThread)

document
    .getElementById("createCommentBtn")
    .addEventListener("click", createComment)
    function confirmAction(message) {

    return confirm(message)

}