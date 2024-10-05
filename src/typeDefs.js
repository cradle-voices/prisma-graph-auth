const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    token: String
    resetToken: String
    isVerified: Boolean
    otps: [Otp!]!
  }

  type Otp {
    id: ID!
    otp: String!
    expires_at: String!
    is_verified: Boolean!
    user: User  # link back to User
    userId: String 
  }

  type Query {
    currentUser: User!
    listOtps: [Otp!]!   
  }

  type Mutation {

    register(password: String!, email: String!): RegistrationResponse!
    login(email: String!, password: String!): LoginResponse!
    verifyOtp(email: String!, otp: String!): Response!
    requestPasswordReset(email: String!): Response!
    resetPassword(token: String!, email: String!, newPassword: String!): Response!
  }

  type LoginResponse {
    success: Boolean!
    message: String
    token: String
    user: User
  }

  type RegistrationResponse {
    success: Boolean!
    message: String
    user: User
  }


  type Response {
  success: Boolean!
  message: String
}
`;

module.exports = typeDefs;
