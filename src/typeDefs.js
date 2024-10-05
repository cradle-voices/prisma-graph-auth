const { gql } = require('apollo-server');

const typeDefs = gql`

  type User{
    id: ID!
    email: String!
  }


  type Query{
    currentUser: User!
  }

  type Mutation{
    register(password: String!, email: String!): RegistrationResponse!
    login(email: String!, password: String!): LoginResponse!
  }

  type LoginResponse{
    success: Boolean!              
    message: String 
    token: String
    user: User
  }


  type RegistrationResponse{
    success: Boolean!              
    message: String 
    user: User
  }








`;

module.exports = typeDefs;
