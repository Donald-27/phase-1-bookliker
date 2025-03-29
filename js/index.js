document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
    const currentUser = { id: 1, username: "pouros" };
  
    // Fetch books and display their titles
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((books) => {
        books.forEach((book) => {
          const li = document.createElement("li");
          li.textContent = book.title;
          li.addEventListener("click", () => displayBookDetails(book));
          listPanel.appendChild(li);
        });
      });
  
    function displayBookDetails(book) {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnailUrl}" alt="${book.title}" />
        <p>${book.description}</p>
        <ul id="users-list">
          ${book.users.map((user) => `<li>${user.username}</li>`).join("")}
        </ul>
        <button id="like-button">${isUserLiked(book) ? "Unlike" : "Like"}</button>
      `;
  
      document.querySelector("#like-button").addEventListener("click", () => toggleLike(book));
    }
  
    function isUserLiked(book) {
      return book.users.some((user) => user.id === currentUser.id);
    }
  
    function toggleLike(book) {
      const userLiked = isUserLiked(book);
      const updatedUsers = userLiked
        ? book.users.filter((user) => user.id !== currentUser.id)
        : [...book.users, currentUser];
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: updatedUsers }),
      })
        .then((response) => response.json())
        .then((updatedBook) => displayBookDetails(updatedBook));
    }
  });
  
