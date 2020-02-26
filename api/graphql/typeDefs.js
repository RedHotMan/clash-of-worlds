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
    inGoingChallenges: Int!
    leaderId: String!
    points: Int!
  }

  type Challenge {
    id: Int!
    state: String
    adminState: String!
    description: String!
    pointsInGame: Int!
    attackerId: Int!
    defenderId: Int!
    date: String!
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
    challenges: [Challenge!]!
    challenge(id: Int!): Challenge
  }

  type Mutation {
    register(registerInput: RegisterInput): User
    login(username: String!, password: String!): User
    createChallenge(
      attackerId: Int!
      defenderId: Int!
      description: String!
      date: String!
      pointsInGame: Int!
    ): Challenge
  }
`;

module.exports = typeDefs;
