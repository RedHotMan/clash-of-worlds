const { isNamedType, isWrappingType } = require("graphql");

const addTypeToSchema = (field, schema) => {
  const typeMap = schema.getTypeMap();
  let type = field.type;

  if (isWrappingType(type)) {
    type = type.ofType;
  }

  if (isNamedType(type) && !typeMap[type.name]) {
    typeMap[type.name] = type;
  }
};

module.exports = addTypeToSchema;
