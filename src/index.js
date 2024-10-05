const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt  = require("jsonwebtoken")

const { prisma } = require('./generated/prisma-client/index');
require("dotenv").config()

const getUser = token =>{
  try{
    if(token){
      return jwt.verify(token, process.env.PRISMA_SECRET)
    }
    return null
  }catch (error){
    return null
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const bearerWithTokens = req.headers.authorization || ""
    const token  =  bearerWithTokens.split(' ')[1]
    const user   =  getUser(token)

    return{
      user,
      prisma
    }
  }
});

server
  .listen({
    port: 8383
  })
  .then(info => console.log(`Server started on http://localhost:${info.port}`));