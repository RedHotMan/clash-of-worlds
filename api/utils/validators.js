const ROLES = require("./roles");

const validateEmail = email => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

module.exports.registerValidation = (username, email, password, role) => {
  const errors = {};

  if (username.trim().length === 0) {
    errors.username = "Username must not be empty";
  } else if (username.trim().length < 4) {
    errors.username = "Username must have at least 4 letters";
  }

  if (email.trim().length === 0) {
    errors.email = "Email must not be empty";
  } else if (!validateEmail(email)) {
    errors.email = "Email must be a valid email address";
  }

  if (password.trim().length === 0) {
    errors.password = "Password must not be empty";
  } else if (password.trim().length < 4) {
    errors.password = "Password must have at least 4 characters";
  } else if (password.trim().includes(" ")) {
    errors.password = "Password must not contain spaces";
  }

  if (role && !Object.values(ROLES).includes(role)) {
    errors.role = `Role must be ${ROLES.USER} or ${ROLES.ADMIN}`;
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.loginValidation = (username, password) => {
  const errors = {};

  if (username.trim().length === 0) {
    errors.username = "Username must not be empty";
  }

  if (password.trim().length === 0) {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
