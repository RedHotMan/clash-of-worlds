const { AuthenticationError } = require("apollo-server");

const isAuthenticated = decodedToken => {
  if (!decodedToken) {
    throw new AuthenticationError("You must be authenticated");
  }
  return true;
};

module.exports = isAuthenticated;
