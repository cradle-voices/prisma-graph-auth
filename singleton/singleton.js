// const { PrismaClient } = require('@prisma/client');

// Create a singleton Prisma client instance
// const prisma = new PrismaClient();

const { prisma } = require('../src/generated/prisma-client/index');
require("dotenv").config()

module.exports = {
  prisma,
};
