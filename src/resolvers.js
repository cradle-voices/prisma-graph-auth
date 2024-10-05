const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")

const resolvers = {
  Mutation: {
    register: async (parent, {password, email}, ctx, info) => {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await ctx.prisma.createUser({
        password: hashedPassword,
        email,
      });

      return user;
    },

    // handle the login processes 
    // handle the login processes 
    login: async (parent, { email, password }, ctx) => {
      try {
        console.log("Email received for login:", email);
    
        // Correct query structure for Prisma 1
        const user = await ctx.prisma.user({ email });
        // Log the Prisma response for debugging
        console.log("User fetched from Prisma:", user);
    
        if (!user) {
          console.error("User not found with this email:", email);
          throw new Error("INVALID EMAIL ADDRESS OR PASSWORD");
        }
    
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          console.error("Password mismatch for user:", user);
          throw new Error("INVALID EMAIL ADDRESS OR PASSWORD");
        }
    
        // Generate a JWT token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.PRISMA_SECRET, // Make sure this env variable is defined
          { expiresIn: "30d" }
        );
    
        // Log token generation success
        console.log("Token generated for user:", user.email);
    
        return { token, user };
      } catch (error) {
        // Catch and log any errors
        console.error("Error during login process:", error);
        throw new Error(error.message);
      }
    },
    

  },
  Query: {
    currentUser: async (parent, args, ctx, info) => {
      return await ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
  },
};

module.exports = resolvers;
