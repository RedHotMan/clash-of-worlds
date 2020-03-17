const { ApolloError } = require("apollo-server");

module.exports = (fieldName, message, code) => {
  throw new ApolloError(message, code, { errors: { [fieldName]: message } });
};
