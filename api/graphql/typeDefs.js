const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: String!
    token: String!
    planetId: Int!
  }

  type Planet {
    id: Int!
    name: String!
    isInWar: Boolean!
    leaderId: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: String
    planetId: Int!
  }

  type Query {
    users: [User!]!
    user(id: String!): User
    planets: [Planet!]!
    planet(id: Int!): Planet
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    login(username: String!, password: String!): User
  }
`;

module.exports = typeDefs;
