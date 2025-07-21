const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// DOM elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-btn_type_preview"
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(
  ".modal__close-btn_type_preview"
);
const addCardFormEl = newPostModal.querySelector(".modal__form");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostTitleInput = document.querySelector("#card-image-input");
const newPostContentInput = document.querySelector("#photo-caption");

const cardTemplateEl = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

const imagePreviewModal = document.querySelector("#image-preview-modal");
const modalImage = imagePreviewModal.querySelector(".modal__image");
const modalCaption = imagePreviewModal.querySelector(".modal__caption");
const modalCloseBtn = imagePreviewModal.querySelector(
  ".modal__close-btn_type_preview"
);

// Functions
function getCardElement(data) {
  const cardElement = cardTemplateEl.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const LikeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  LikeBtn.addEventListener("click", function (evt) {
    LikeBtn.classList.toggle("card__like-btn-active");
  });

  deleteBtn.addEventListener("click", function (evt) {
    deleteBtn.classList.toggle("card__delete-btn-active");
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", function () {
    console.log("Preview clicked:", data.link);
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
    openModal(imagePreviewModal);
  });

  return cardElement;
}

function openModal(modalElement) {
  modalElement.classList.add("modal_is-opened");
}

function closeModal(modalElement) {
  modalElement.classList.remove("modal_is-opened");
}

// Event listeners
editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const cardData = {
    name: newPostContentInput.value,
    link: newPostTitleInput.value,
  };

  const cardElement = getCardElement(cardData);
  cardsList.prepend(cardElement);
  addCardFormEl.reset();
  closeModal(newPostModal);
});

modalCloseBtn.addEventListener("click", function (evt) {
  closeModal(imagePreviewModal);
});

// initial cards
initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});
