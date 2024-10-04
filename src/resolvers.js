const bcrypt = require("bcryptjs");

const resolvers = {
  Mutation: {
    register: async (parent, {password, username }, ctx, info) => {
      // Log the input values
      console.log("Received registration data:", {password, username });

      // Check for null values
     

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user using email, username, and hashed password
      const user = await ctx.prisma.createUser({
        password: hashedPassword,
        username,
      });

      return user;
    },
  },
  Query: {
    currentUser: async (parent, args, ctx, info) => {
      // Implement logic to fetch current user
      return await ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
  },
};

module.exports = resolvers;
