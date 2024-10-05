const { ApolloServer } = require('apollo-server-express'); // Use apollo-server-express
const express = require('express'); // Import express
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const { prisma } = require('./generated/prisma-client/index');
require('dotenv').config();

// Create an Express application
const app = express();

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.PRISMA_SECRET);
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Create an Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const bearerWithTokens = req.headers.authorization || '';
    const token = bearerWithTokens.split(' ')[1];
    const user = getUser(token);

    return {
      user,
      prisma,
    };
  },
});

// Start the Apollo Server
const startServer = async () => {
  await server.start(); // Wait for the server to start
  server.applyMiddleware({ app }); // Apply middleware to the express app

  app.listen({ port: 8384 }, () => {
    console.log(`Server ready at http://localhost:8384${server.graphqlPath}`);
  });
};

// Start the server
startServer().catch((error) => {
  console.error('Error starting server:', error);
});
