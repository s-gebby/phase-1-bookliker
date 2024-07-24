document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((books) => {
      const list = document.getElementById("list");
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        list.appendChild(li);
      });
    });
}

function showBookDetails(book) {
  const showPanel = document.getElementById("show-panel");
  showPanel.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.img_url}" alt="${book.title}">
    <p>${book.description}</p>
    <ul id="user-list">
      ${book.users.map((user) => `<li>${user.username}</li>`).join("")}
    </ul>
    <button id="like-button">LIKE</button>
  `;
  document
    .getElementById("like-button")
    .addEventListener("click", () => likeBook(book));
}

function likeBook(book) {
  const currentUser = { id: 1, username: "pouros" };
  const userList = document.getElementById("user-list");
  const userIndex = book.users.findIndex((user) => user.id === currentUser.id);

  if (userIndex >= 0) {
    book.users.splice(userIndex, 1);
  } else {
    book.users.push(currentUser);
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ users: book.users }),
  })
    .then((response) => response.json())
    .then((updatedBook) => {
      userList.innerHTML = updatedBook.users
        .map((user) => `<li>${user.username}</li>`)
        .join("");
    });
}
