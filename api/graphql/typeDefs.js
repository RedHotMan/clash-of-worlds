const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @string(
    maxLength: Int
    minLength: Int
    type: StringType
  ) on INPUT_FIELD_DEFINITION

  directive @number(min: Int, max: Int) on INPUT_FIELD_DEFINITION

  directive @role on INPUT_FIELD_DEFINITION

  directive @date(
    isAfter: DateType
    isBefore: DateType
    format: String
  ) on INPUT_FIELD_DEFINITION

  directive @auth on FIELD_DEFINITION

  enum StringType {
    EMAIL
    PASSWORD
    ROLE
  }

  enum DateType {
    YESTERDAY
    TODAY
    TOMORROW
  }

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
    id: ID!
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
    username: String! @string(minLength: 4)
    email: String! @string(type: EMAIL)
    password: String! @string(type: PASSWORD, minLength: 4)
    role: String @string(type: ROLE)
    planetId: Int!
  }

  input CreateChallengeInput {
    userId: String!
    attackerId: Int!
    defenderId: Int!
    description: String! @string(minLength: 20, maxLength: 250)
    date: String! @date(isAfter: TODAY)
    pointsInGame: Int! @number(min: 10, max: 200)
  }

  type Query {
    login(username: String!, password: String!): Token!
    users: [User!]! @auth
    user(id: ID!): User @auth
    planets: [Planet!]! @auth
    planet(id: ID!): Planet @auth
    challenges: [Challenge!]! @auth
    challenge(id: Int!): Challenge @auth
  }

  type Mutation {
    register(registerInput: RegisterInput): Token!
    createChallenge(createChallengeInput: CreateChallengeInput): Challenge @auth
    acceptChallenge(userId: String!, challengeId: Int!): Challenge @auth
    refuseChallenge(userId: String!, challengeId: Int!): Challenge @auth
    cancelChallenge(userId: String!, challengeId: Int!): Challenge @auth
    setWinnerChallenge(
      userId: String!
      challengeId: Int!
      winner: String!
    ): Challenge @auth
  }
`;

module.exports = typeDefs;
