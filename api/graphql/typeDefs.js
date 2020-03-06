const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: String!
    planet: Planet
  }

  type Token {
    token: String
  }

  type Planet {
    id: ID!
    name: String!
    leader: User!
    points: Int!
  }

  type Challenge {
    id: Int!
    state: String
    adminState: String!
    description: String!
    pointsInGame: Int!
    attacker: Planet!
    defender: Planet!
    date: String!
    winner: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: String
    planetId: Int!
  }

  type Query {
    login(username: String!, password: String!): Token!
    users: [User!]!
    user(id: ID!): User
    planets: [Planet!]!
    planet(id: ID!): Planet
    challenges: [Challenge!]!
    challenge(id: Int!): Challenge
  }

  type Mutation {
    register(registerInput: RegisterInput): Token!
    createChallenge(
      userId: String!
      attackerId: Int!
      defenderId: Int!
      description: String!
      date: String!
      pointsInGame: Int!
    ): Challenge
    acceptChallenge(userId: String!, challengeId: Int!): Challenge
    refuseChallenge(userId: String!, challengeId: Int!): Challenge
    cancelChallenge(userId: String!, challengeId: Int!): Challenge
    setWinnerChallenge(
      userId: String!
      challengeId: Int!
      winner: String!
    ): Challenge
  }
`;

module.exports = typeDefs;
