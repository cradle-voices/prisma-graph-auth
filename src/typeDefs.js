const { gql } = require('apollo-server');

const typeDefs = gql`

  type User{
    id: ID!
    username: String!
    email: String!
  }


  type Query{
    currentUser: User!
  }

  type Mutation{
    register(email: String!, password: String!, username: String): User!
    login(email: String!, password: String!): LoginResponse!
  }

  type LoginResponse{
    token: String
    user: User
  }







`;

module.exports = typeDefs;
