const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: String!
    token: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    login(username: String!, password: String!): User
  }
`;

module.exports = typeDefs;
