const { SchemaDirectiveVisitor } = require("apollo-server");
const { GraphQLScalarType, GraphQLNonNull, GraphQLString } = require("graphql");
const emailValidator = require("../../utils/emailValidator");
const directiveError = require("../../utils/directiveError");
const addTypeToSchema = require("../../utils/addTypeToSchema");
const { ROLES } = require("../../utils/constants");

const ERROR_CODE = "STRING_CONSTRAINT_ERROR";

class StringConstraintDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  wrapType(field) {
    const fieldName = field.astNode.name.value;
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType === GraphQLString
    ) {
      field.type = new GraphQLNonNull(
        new StringConstraintType(fieldName, field.type.ofType, this.args)
      );
    } else if (field.type === GraphQLString) {
      field.type = new StringConstraintType(fieldName, field.type, this.args);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }

    addTypeToSchema(field, this.schema);
  }
}

class StringConstraintType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `StringConstraint${fieldName.toUpperCase()}`,
      serialize(value) {
        value = type.serialize(value);
        validate(fieldName, value, args);
        return value;
      },
      parseValue(value) {
        value = type.parseValue(value);
        validate(fieldName, value, args);
        return value;
      },
      parseLiteral(ast) {
        const value = type.parseLiteral(ast);
        validate(fieldName, value, args);
        return value;
      }
    });
  }
}

const validate = (fieldName, value, args) => {
  if (args.minLength && value.trim().length < args.minLength) {
    directiveError(
      fieldName,
      `Field ${fieldName} must have at least ${args.minLength} characters`,
      ERROR_CODE
    );
  }

  if (args.maxLength && value.trim().length > args.maxLength) {
    directiveError(
      fieldName,
      `Field ${fieldName} must have at most ${args.maxLength} characters`,
      ERROR_CODE
    );
  }

  if (args.type) {
    switch (args.type) {
      case "EMAIL":
        if (!emailValidator(value)) {
          directiveError(
            fieldName,
            `Field ${fieldName} must be a valid email address`,
            ERROR_CODE
          );
        }
        break;
      case "PASSWORD":
        if (value.trim().includes(" ")) {
          directiveError(
            fieldName,
            `Field ${fieldName} should not contain spaces`,
            ERROR_CODE
          );
        }
        break;
      case "ROLE":
        const rolesValues = Object.values(ROLES);
        if (!rolesValues.includes(value)) {
          directiveError(
            fieldName,
            `${fieldName} must be ${ROLES.USER} or ${ROLES.ADMIN}`,
            ERROR_CODE
          );
        }
      default:
        break;
    }
  }
};

module.exports = StringConstraintDirective;
