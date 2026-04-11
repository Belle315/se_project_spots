import Api from "../utils/Api.js";
import {
  enableValidation,
  validationConfig,
  resetFormErrors,
  showInputError,
  hideInputError,
  checkInputValidity,
} from "../scripts/validation.js";
import "./index.css";
import addImg from "../images/add-img.svg";
document.querySelector(".profile__add-img").src = addImg;
import editProfileIcon from "../images/edit-icon.svg";
document.querySelector(".profile__edit-img").src = editProfileIcon;
import logo from "../images/Logo.svg";
document.querySelector(".header__logo").src = logo;
import pencilIcon from "../images/PencilAEdit.svg";
document.querySelector(".profile__edit-icon").src = pencilIcon;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",

  headers: {
    authorization: "590c5c7c-d250-4fa4-a5e0-dd54f7ff37d4",
    "Content-Type": "application/json",
  },
});

// DOM elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const editProfileForm = editProfileModal.querySelector(".modal__form");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormEl = newPostModal.querySelector(".modal__form");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostTitleInput = document.querySelector("#photo-caption");
const newPostContentInput = document.querySelector("#card-image-input");

const cardTemplateEl = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");
console.log("cardsList element:", cardsList);

const imagePreviewModal = document.querySelector("#image-preview-modal");
const modalImage = imagePreviewModal.querySelector(".modal__image");
const modalCaption = imagePreviewModal.querySelector(".modal__caption");
const modalCloseBtn = imagePreviewModal.querySelector(
  ".modal__close-btn_type_preview",
);

let selectedCard = null;
let selectedCardId = null;
let currentUserId = null;

const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const avatarEditBtn = document.querySelector(".profile__avatar-edit-btn");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.querySelector("#edit-avatar-form");
const avatarLinkInput = document.querySelector("#avatar-link-input");

// Functions
function getCardElement(data) {
  const cardElement = cardTemplateEl.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const likeBtn = cardElement.querySelector(".card__like-btn");
  const deleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.owner !== currentUserId) {
    deleteBtn.style.display = "none";
  }

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  }

  likeBtn.addEventListener("click", function () {
    const isLiked = likeBtn.classList.contains("card__like-btn_active");

    api
      .changeLikeStatus(data._id, !isLiked)
      .then((updatedCard) => {
        console.log("Updated card received:", updatedCard);
        if (updatedCard.isLiked) {
          likeBtn.classList.add("card__like-btn_active");
        } else {
          likeBtn.classList.remove("card__like-btn_active");
        }
      })
      .catch(console.error);
  });

  deleteBtn.addEventListener("click", function () {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteCardModal);
  });

  cardImageEl.addEventListener("click", function () {
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
    openModal(imagePreviewModal);
  });

  return cardElement;
}

function openModal(modalElement) {
  modalElement.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
  modalElement.addEventListener("click", handleOverlayClick);
}

function closeModal(modalElement) {
  modalElement.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
  modalElement.removeEventListener("click", handleOverlayClick);
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Event listeners
editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetFormErrors(editProfileModal, validationConfig);
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const submitBtn = evt.target.querySelector(".modal__submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "saving...";

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  Promise.all([api.updateUserInfo({ name, about })])
    .then(([userData, avatarData]) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
    });
});

const deleteCardCloseBtn = deleteCardModal.querySelector(".modal__close-btn");
deleteCardCloseBtn.addEventListener("click", function () {
  closeModal(deleteCardModal);
});

const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");

editAvatarCloseBtn.addEventListener("click", function () {
  closeModal(editAvatarModal);
});
deleteCardCloseBtn.addEventListener("click", function () {
  closeModal(deleteCardModal);
});

const deleteCardCancelBtn = deleteCardModal.querySelector(".modal__cancel-btn");

deleteCardCancelBtn.addEventListener("click", function () {
  closeModal(deleteCardModal);
});

avatarEditBtn.addEventListener("click", () => {
  avatarLinkInput.value = "";
  resetFormErrors(editAvatarModal, validationConfig);
  openModal(editAvatarModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

addCardFormEl.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const link = newPostContentInput.value;
  const name = newPostTitleInput.value;

  api
    .addCard({ name, link })
    .then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);
      addCardFormEl.reset();
      closeModal(newPostModal);
    })
    .catch(console.error);
});

modalCloseBtn.addEventListener("click", function (evt) {
  closeModal(imagePreviewModal);
});

deleteCardForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error);
});

editAvatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.target.querySelector(".modal__submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "saving...";

  api
    .updateAvatar({ avatar: avatarLinkInput.value })
    .then((userData) => {
      document.querySelector(".profile__avatar").src = userData.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
    });
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    document.querySelector(".profile__avatar").src = userData.avatar;
    console.log("Cards received:", cards);
    console.log("Number of cards:", cards.length);

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

enableValidation(validationConfig);
