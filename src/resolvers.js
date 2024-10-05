const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const validator = require("validator");

const resolvers = {
  Mutation: {
    register: async (parent, {password, email}, ctx, info) => {

      //response  data structure 
      const response = {
        success: false,
        message: "",
        user: null,
      };
      const hashedPassword = await bcrypt.hash(password, 10);

      // validate the email address given 
      if (!validator.isEmail(email)) {
        response.message = "Invalid email address  format.";
        return response
        // throw new Error("Invalid email format.");
      }
      //validate the password 
      if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
        response.message = "Password must be at least 8 characters long, and include numbers and special characters.";
        return response
        // throw new Error("Password must be at least 8 characters long, and include numbers and special characters.");
      }
      const user = await ctx.prisma.createUser({
        password: hashedPassword,
        email,
      });

      response.message = "User created successfuly";
      response.success = true
      response.user = user

      

      return response;
    },


    // handle the login processes 
    login: async (parent, { email, password }, ctx) => {

      //response  data structure 
      const response = {
        success: false,
        message: "",
        user: null,
        token: null,
      };


      try {
        const user = await ctx.prisma.user({ email });
    
        if (!user) {
          response.message = "Invalid email address or password.";
          return response
        }
    
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
          response.message = "Invalid email address or password.";
          return response
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
    
        response.success = true;
        response.message = "Login successful.";
        response.user = user;
        response.token = token;

    return response;
      } catch (error) {
        response.message = "An error occurred during the login process.";
        console.error(error);
        return response;
      }
        
      },
    
    

  },
  Query: {
    currentUser: async (parent, args, {user, prisma}) => {
      if(!user){
        throw new Error("NOT authenticated")
      }
      return prisma.user({id: user.id})
    },
  },
};

module.exports = resolvers;
