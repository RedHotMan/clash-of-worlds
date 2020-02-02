const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    firstname: String!
    lastname: String!
    username: String
    email: String!
    password: String!
    role: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    createUser(firstname: String!, username: String, lastname: String!, email: String!, password: String!, role: String): User
  }
`;

module.exports = typeDefs;
