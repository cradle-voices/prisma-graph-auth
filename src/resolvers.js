const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const validator = require("validator");

const resolvers = {
  Mutation: {
    register: async (parent, {password, email}, ctx, info) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      // validate the email address given 
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
      }
      //validate the password 
      if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
        throw new Error("Password must be at least 8 characters long, and include numbers and special characters.");
      }
      const user = await ctx.prisma.createUser({
        password: hashedPassword,
        email,
      });

      return user;
    },


    // handle the login processes 
    login: async (parent, { email, password }, ctx) => {
      try {
        const user = await ctx.prisma.user({ email });
    
        if (!user) {
          throw new Error("INVALID EMAIL ADDRESS OR PASSWORD");
        }
    
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          throw new Error("INVALID EMAIL ADDRESS OR PASSWORD");
        }
    
        // Generate a JWT token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.PRISMA_SECRET, // used in env variables instead of env file 
          { expiresIn: "30d" }
        );
    
        // Log token generation success
    
        return { token, user };
      } catch (error) {
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
