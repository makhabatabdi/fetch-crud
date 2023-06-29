const API = "https://jsonplaceholder.typicode.com/posts";
const cards = document.querySelector(".cards");
const inputTitle = document.querySelector(".input-title");
const inputDescription = document.querySelector(".input-description");
const addButton = document.querySelector(".btn-add");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".input-editTitle");
const modalDescription = document.querySelector(".input-editDescription");
const btnSave = document.querySelector(".btn-save");
let newCard = "";

function getPosts() {
  fetch(API)
    .then((res) => res.json())
    .then((posts) => {
      posts.slice(0, 12).map((post) => {
        return (newCard += `<div class="card" data-id="${post.id}" style="width: 20rem">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">
              ${post.body}
            </p>
            <button class="btn btn-primary btn-edit" data-id="${post.id}">Edit</button>
            <button class="btn btn-primary btn-delete" data-id="${post.id}">Delete</button>
          </div>
        </div>`);
      });
      cards.innerHTML = newCard;
    })
    .catch((error) => console.log(error));
}

getPosts();

cards.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    deletePost(id, e.target.closest(".card"));
  }
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    modal.style.display = "block";
    getPost(id);
  }
});

function deletePost(id, cardElement) {
  fetch(API + "/" + id, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        console.log("Data deleted");
        cardElement.remove();
      }
    })
    .catch((error) => console.log(error));
}

function addPost(title, description) {
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      title: title,
      body: description,
      userId: 1,
      id: Date.now(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log("Post added");
        inputTitle.value = "";
        inputDescription.value = "";
        return res.json();
      } else {
        throw new Error("Failed to add");
      }
    })
    .then((post) => {
      const newCardHTML = `<div class="card" style="width: 20rem">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">
              ${post.body}
            </p>
            <button class="btn btn-primary btn-edit" data-id="${post.id}">Edit</button>
            <button class="btn btn-primary btn-delete" data-id="${post.id}">Delete</button>
          </div>
        </div>`;
      cards.insertAdjacentHTML("afterbegin", newCardHTML);
    })
    .catch((error) => console.log(error));
}

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const newTitle = inputTitle.value;
  const newDescription = inputDescription.value;
  addPost(newTitle, newDescription);
});

function updatePost(title, description, id) {
  const cardElement = document.querySelector(`[data-id="${id}"]`);
  fetch(API + "/" + id, {
    method: "PUT",
    body: JSON.stringify({
      title: title,
      body: description,
      id: id,
      userId: 1,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((updatePost) => {
      const cardTitle = cardElement.querySelector(".card-title");
      const cardBody = cardElement.querySelector(".card-text");
      cardTitle.textContent = updatePost.title;
      cardBody.textContent = updatePost.body;
      modal.style.display = "none";
      modalTitle.value = "";
      modalDescription.value = "";
    })
    .catch((error) => console.log(error));
}

btnSave.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-id");
  updatePost(modalTitle.value, modalDescription.value, id);
});

function getPost(id) {
  fetch(API + "/" + id, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      modalTitle.value = data.title;
      modalDescription.value = data.body;
      btnSave.setAttribute("data-id", data.id);
    })
    .catch((error) => console.log(error));
}
