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
  const currentUser = { id: 1, username: "pouros" };
  const userHasLiked = book.users.some((user) => user.id === currentUser.id);
  const likeButtonText = userHasLiked ? "UNLIKE" : "LIKE";

  showPanel.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.img_url}" alt="${book.title}">
    <p>${book.description}</p>
    <ul id="user-list">
      ${book.users.map((user) => `<li>${user.username}</li>`).join("")}
    </ul>
    <button id="like-button">${likeButtonText}</button>
  `;
  document
    .getElementById("like-button")
    .addEventListener("click", () => likeBook(book));
}

function likeBook(book) {
  const currentUser = { id: 1, username: "pouros" }; // Replace with the actual current user
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
      const userList = document.getElementById("user-list");
      userList.innerHTML = updatedBook.users
        .map((user) => `<li>${user.username}</li>`)
        .join("");

      const likeButton = document.getElementById("like-button");
      likeButton.textContent = updatedBook.users.some(
        (user) => user.id === currentUser.id
      )
        ? "UNLIKE"
        : "LIKE";
    });
}
