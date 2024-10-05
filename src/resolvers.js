const { sendVerificationEmail, generateOTP } = require('./utils/emailUtils');
const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const validator = require("validator");

const resolvers = {
  Mutation: {
    register: async (parent, {password, email}, ctx, info) => {
      
      const response = {
        success: false,
        message: "",
        user: null,
      };
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP(); 
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000); 
      
      if (!validator.isEmail(email)) {
        response.message = "Invalid email address  format.";
        return response
      }
      if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
        response.message = "Password must be at least 8 characters long, and include numbers and special characters.";
        return response
      }
      const user = await ctx.prisma.createUser({
        password: hashedPassword,
        email,
        isVerified: false,
        token: null, 
      });
      
      //creaete the otp record 
      const otpRecord = await ctx.prisma.createOtp({
        user: { connect: { id: user.id } }, 
        otp,
        expires_at: expiryTime,
        is_verified: false,
        userId:  user.id 
      });
      
      // console.log("OTP Record Created:", {
      //   id: otpRecord.id, 
      //   otp: otpRecord.otp,
      //   expires_at: otpRecord.expires_at,
      //   is_verified: otpRecord.is_verified,
      //   userId: otpRecord.userId,
      // });
      
      // having some issues settign up the smtp
      // await sendVerificationEmail(email, otp);
      // console.log(response2)
      //including otp in response as am having difficulties sanding mails 
      response.message = "User created successfuly, here is your OTP: "+otp;
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
        // console.error(error);
        return response;
      }
      
    },
    
    
    verifyOtp: async (parent, { email, otp }, ctx, info) => {
      const response = {
        success: false,
        message: "",
      };
      
      try {
        // get user based on the email 
        const user = await ctx.prisma.user({ email });
        
        if (!user) {
          response.message = "User not found.";
          return response;
        }
        
        // Fetch the OTP record 
        const otpRecord = await ctx.prisma.otps({
          where: {
            otp, // Match the provided OTP
            user: { id: user.id }, // Connect OTP to user
          },
        });
        
        // check if the OTP exists and is not yet verified
        if (otpRecord.length === 0) {
          response.message = "Invalid OTP for this email.";
          return response;
        }
        
        const otpData = otpRecord[0]; // Get the first OTP record
        
        if (otpData.is_verified) {
          response.message = "OTP has already been verified.";
          return response;
        }
        
        // Check if the OTP has expired
        const currentTime = new Date();
        if (otpData.expires_at < currentTime) {
          response.message = "OTP has expired.";
          return response;
        }
        
        // Mark the OTP as verified
        await ctx.prisma.updateOtp({
          where: { id: otpData.id }, 
          data: { is_verified: true },
        });
        
        // veryfy the user too 
        await ctx.prisma.updateUser({
          where: { id: user.id },
          data: { isVerified: true },
        });
        
        response.success = true;
        response.message = "OTP verified successfully.";
      } catch (error) {
        // console.error(error);
        response.message = "An error occurred while verifying the OTP.";
      }
      
      return response;
    },
    
    requestPasswordReset: async (parent, { email }, ctx) => {
      const response = {
        success: false,
        message: "",
      };
      
      try {
        const user = await ctx.prisma.user({ email });
        if (!user) {
          response.message = "Email does not exist.";
          return response;
        }
        
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.PRISMA_SECRET, 
          { expiresIn: "1h" } 
        );
        
        
        // Send password reset email with link containing token and email
        const resetLink = `https://ngeni.io/reset-password?token=${token}&email=${email}`;
        // await sendPasswordResetEmail(email, resetLink);
        // console.log(resetLink)
        
        response.success = true;
        response.message = "Password reset email sent. here is the token sent "+token;
        return response;
      } catch (error) {
        // console.error("Error during password reset request:", error);
        response.message = "An error occurred.";
        return response;
      }
    },
    
    
    
    
    resetPassword: async (parent, { token, email, newPassword }, ctx) => {
      const response = {
        success: false,
        message: "",
      };
      
      // console.log("Starting password reset process...");
      // console.log(`Received token: ${token}, email: ${email}, newPassword: ${newPassword}`);
      
      try {
        const decoded = jwt.verify(token, process.env.PRISMA_SECRET); 
        
        if (decoded.email !== email) {
          response.message = "Invalid token or email.";
          throw new Error(response.message);
        }
        
        // console.log("token verified successfully");
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user's password in the database
        await ctx.prisma.updateUser({
          where: { email },
          data: { password: hashedPassword },
        });
        
        // console.log("User password updated successfully");
        
        response.success = true;
        response.message = "Password reset successful.";
        return response;
      } catch (error) {
        // console.error("Token verification failed:", error.message);
        response.message = "Token verification failed.";
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
    
    listOtps: async (parent, args, ctx, info) => {
      const otps = await ctx.prisma.otps(); // Fetch all OTPs
      
      // Filter out OTPs that do not have a userId,ie  for development 
      const filteredOtps = otps.filter(otp => otp.userId);
      
      const otpsWithUsers = await Promise.all(
        filteredOtps.map(async (otp) => {
          // console.log("hello");
          // console.log("OTP Object:", otp.userId);
          
          const user = await ctx.prisma.user({ id: otp.userId }); // confirn valid id 
          
          return {
            ...otp,
            user, // Attach the user data to the OTP record
          };
        })
      );
      
      // console.log(otpsWithUsers); // Log the results for debugging
      
      return otpsWithUsers;
    },
    
    
  },
};

module.exports = resolvers;
