const bcrypt = require("bcryptjs");

const resolvers = {
  Mutation: {
    register: async (parent, { email, password, username }, ctx, info) => {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user using email, username, and hashed password
      const user = await ctx.prisma.createUser({
        data: {
          email,
          password: hashedPassword,
          username,

        },
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
