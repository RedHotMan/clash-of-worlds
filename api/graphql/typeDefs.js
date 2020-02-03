const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
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
  }

  type Mutation {
    createUser(
      firstname: String!
      lastname: String!
      username: String
      email: String!
      password: String!
    ): User
  }
`;

module.exports = typeDefs;
