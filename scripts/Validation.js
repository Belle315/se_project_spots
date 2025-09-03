const checkInputValidity = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!inputElement.validity.valid) {
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(config.errorVisibleClass);
    inputElement.classList.add(config.inputErrorClass);
  } else {
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorVisibleClass);
    inputElement.classList.remove(config.inputErrorClass);
  }
};

const toggleButtonState = (inputList, buttonElement, config) => {
  const isFormValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );
  buttonElement.disabled = !isFormValid;

  if (!isFormValid) {
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_invalid",
  errorVisibleClass: "modal__input-error_visible",
};

enableValidation(validationConfig);
