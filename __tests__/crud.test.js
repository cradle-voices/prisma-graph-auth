const request = require('supertest');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../src/typeDefs'); // Adjust the path according to your structure
const resolvers = require('../src/resolvers'); // Adjust the path according to your structure
const { prisma } = require('../src/generated/prisma-client/index'); // Make sure the path is correct
require('dotenv').config();

// Create an Express app
const app = express();

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ prisma }),
});

describe('GraphQL Resolvers', () => {
    beforeAll(async () => {
        await server.start(); // Start the Apollo server
        server.applyMiddleware({ app }); // Apply Apollo GraphQL middleware to the app
    });
    
    afterEach(async () => {
        const user = await prisma.user({ email: "test3@gmail.com" });
        
        if (user) {
            await prisma.deleteUser({ id: user.id }); // Delete the user by their unique ID
        }

       
    });
    
    const sendGraphQLRequest = async (query) => {
        return await request(app) // Use the Express app here
        .post('/graphql')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Connection', 'keep-alive')
        .set('DNT', '1')
        .set('Origin', 'http://localhost:8384')
        .send({ query });
    };
    
    describe('User Registration', () => {
        it('should register a user and send an OTP', async () => {
            const query = `
              mutation {
                  register(password: "khhh##4QQWWFF123", email: "test3@gmail.com") {
                      success
                      message
                      user {
                          id
                          email
                      }
                  }
              }
          `;
            const res = await sendGraphQLRequest(query);
            //   console.log(res)
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.register.success).toBe(true);
            expect(res.body.data.register.user.email).toBe("test3@gmail.com");
        });
        
        it('should not register a user with an existing email', async () => {
            // Register a user first
            const query = `
              mutation {
                  register(password: "khhh##4QQWWFF123", email: "test3@gmail.com") {
                      success
                      message
                  }
              }
          `;
            await sendGraphQLRequest(query);
            
            // Try to register the same user again
            const res = await sendGraphQLRequest(`
              mutation {
                  register(password: "khhh##4QQWWFF123", email: "test3@gmail.com") {
                      success
                      message
                  }
              }
          `);
                
                // console.log(res.body.data)
                expect(res.statusCode).toBe(200);
            });
    });
        
        //   login tests 
        
    describe('User Login', () => {
        it('should login a user with correct credentials', async () => {
            // Register the user first if not done already
            await sendGraphQLRequest(`
                mutation {
                register(password: "khhh##4QQWWFF123", email: "login@example.com") {
                    success
                    message
                }
                }
            `);
                    
            const res = await sendGraphQLRequest(`
                mutation {
                login(email: "login@example.com", password: "khhh##4QQWWFF123") {
                    success
                    token
                    message
                }
                }
            `);
                        
            expect(res.statusCode).toBe(200);
            expect(res.body.data.login.success).toBe(true);
            expect(res.body.data.login.token).toBeDefined();
        });
                    
        it('should not login a user with incorrect credentials', async () => {
            const res = await sendGraphQLRequest(`
                mutation {
                login(email: "nonexistent@example.com", password: "WrongPassword") {
                    success
                    message
                }
                }
            `);
                            
            expect(res.statusCode).toBe(200);
            expect(res.body.data.login.success).toBe(false);
            expect(res.body.data.login.message).toBe("Invalid email address or password.");
            });
            });
                    
                    
            //   password reset test 
            describe('Verify OTP', () => {
                it('should verify the OTP for a registered user', async () => {
                // Register a user and generate an OTP first
                const registerRes = await sendGraphQLRequest(`
            mutation {
              register(password: "khhh##4QQWWFF123", email: "otpverify3@example.com") {
                success
                message
              }
            }
          `);
                                
            // Use the OTP generated during registration
            // console.log(registerRes.body.data)
            const otp = registerRes.body.data.register.message.split("OTP: ")[1];
            const res = await sendGraphQLRequest(`
            mutation {
              verifyOtp(email: "otpverify3@example.com", otp: "${otp}") {
                success
                message
              }
            }
          `);
                                    
            expect(res.statusCode).toBe(200);
            expect(res.body.data.verifyOtp.success).toBe(true);
            expect(res.body.data.verifyOtp.message).toBe("OTP verified successfully.");
        });
                                
        it('should fail to verify an incorrect OTP', async () => {
                                    const res = await sendGraphQLRequest(`
            mutation {
              verifyOtp(email: "otpverify3@example.com", otp: "wrong-otp") {
                success
                message
              }
            }
          `);
                                        
            expect(res.statusCode).toBe(200);
            expect(res.body.data.verifyOtp.success).toBe(false);
            expect(res.body.data.verifyOtp.message).toBe("Invalid OTP for this email.");
        });
        
    });
                                
                                
                                
});
                            