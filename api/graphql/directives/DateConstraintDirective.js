const { SchemaDirectiveVisitor, ApolloError } = require("apollo-server");
const { GraphQLScalarType, GraphQLNonNull, GraphQLString } = require("graphql");
const moment = require("moment");
const directiveError = require("../../utils/directiveError");
const addTypeToSchema = require("../../utils/addTypeToSchema");

const ERROR_CODE = "DATE_CONSTRAINT_ERROR";

class DateConstraintDirective extends SchemaDirectiveVisitor {
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
        new DateConstaintType(fieldName, field.type.ofType, this.args)
      );
    } else if (field.type === GraphQLString) {
      field.type = new DateConstaintType(fieldName, field.type, this.args);
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }

    addTypeToSchema(field, this.schema);
  }
}

class DateConstaintType extends GraphQLScalarType {
  constructor(fieldName, type, args) {
    super({
      name: `DateConstraint${fieldName.toUpperCase()}`,
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
  const yesterday = moment()
    .subtract(1, "d")
    .startOf("day");

  const today = moment().startOf("day");

  const tomorrow = moment()
    .add(1, "d")
    .startOf("day");

  if (args.isAfter) {
    switch (args.isAfter) {
      case "YESTERDAY":
        if (moment(value, "MM/DD/YYYY").isBefore(yesterday)) {
          directiveError(
            fieldName,
            `Date ${value} must be after yesterday ${yesterday.format(
              "MM/DD/YYYY"
            )}`,
            ERROR_CODE
          );
        }
        break;
      case "TODAY":
        if (moment(value, "MM/DD/YYYY").isBefore(moment().startOf("day"))) {
          directiveError(
            fieldName,
            `Date ${value} must be after today ${today.format("MM/DD/YYYY")}`,
            ERROR_CODE
          );
        }
        break;
      case "TOMORROW":
        if (
          moment(value, "MM/DD/YYYY").isBefore(
            moment()
              .add(1, "d")
              .startOf("day")
          )
        ) {
          directiveError(
            fieldName,
            `Date ${value} must be after tomorrow ${tomorrow.format(
              "MM/DD/YYYY"
            )}`,
            ERROR_CODE
          );
        }
      default:
        break;
    }
  }
};

module.exports = DateConstraintDirective;
