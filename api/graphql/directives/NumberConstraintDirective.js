const { SchemaDirectiveVisitor, ApolloError } = require("apollo-server");
const { GraphQLScalarType, GraphQLNonNull, GraphQLInt } = require("graphql");
const directiveError = require("../../utils/directiveError");
const addTypeToSchema = require("../../utils/addTypeToSchema");

const ERROR_CODE = "NUMBER_CONSTRAINT_ERROR";

class NumberConstraintDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  wrapType(field) {
    const fieldName = field.astNode.name.value;
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType === GraphQLInt
    ) {
      field.type = new GraphQLNonNull(
        new NumberConstraintType(fieldName, field.type.ofType, this.args)
      );
    } else if (field.type === GraphQLInt) {
      field.type = new NumberConstraintType(fieldName, field.type, this.args);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }

    addTypeToSchema(field, this.schema);
  }
}

class NumberConstraintType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `NumberConstraint${fieldName.toUpperCase()}`,
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
        validate(fieldName, parseInt(ast.value), args);
        return value;
      }
    });
  }
}

const validate = (fieldName, value, args) => {
  if (args.min && value < args.min) {
    directiveError(
      fieldName,
      `Field ${fieldName} value must be at least ${args.min}`,
      ERROR_CODE
    );
  }

  if (args.max && value > args.max) {
    directiveError(
      fieldName,
      `Field ${fieldName} value must be at most ${args.max}`,
      ERROR_CODE
    );
  }
};

module.exports = NumberConstraintDirective;
