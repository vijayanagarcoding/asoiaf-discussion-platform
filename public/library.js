const api = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", loadBooks);

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

    const container = document.getElementById("bookGrid");

    container.innerHTML = "";

    books.forEach(book => {

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `
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

        card.onclick = () => {

            window.location.href =
                `index.html?book=${book._id}`;

        };

        container.appendChild(card);

    });

}
