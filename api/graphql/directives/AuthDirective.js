const {
  SchemaDirectiveVisitor,
  AuthenticationError
} = require("apollo-server");

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field;
    field.resolve = async function(...args) {
      const { decodedToken } = args[2];

      if (!decodedToken) {
        throw new AuthenticationError("Your must be authenticated");
      }

      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
