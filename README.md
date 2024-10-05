# Prisma Apollo Server Starter

This repository provides a starting point to work with apollo-server and prisma


## Getting started

1. Clone this repo
2. Run `npm install` to grab dependencies from npm.
3. Start prisma and database instance using `docker-compose up -d` (Run `yarn deploy -n` to use prisma demo servers)
4. Deploy the datamodel using `prisma deploy`
5. Start the server using `npm run dev`

## Directory Structure

```bash
├── __tests__               # Test files
│   ├── crud.test.js        # Unit tests for CRUD operations
│   └── tokenUtils.test.js  # Unit tests for token utilities
├── singleton               # Singleton pattern-related files
│   └── singleton.js        # Singleton pattern implementation
├── src                     # Source code
│   ├── .env                # Environment variables
│   ├── index.js            # Entry point for the application
│   ├── resolvers.js        # GraphQL resolvers
│   ├── server.js           # Apollo Server setup
│   ├── typeDefs.js         # GraphQL schema definitions
│   ├── generated           # Auto-generated Prisma client code
│   │   ├── prisma-client
│   │   │   ├── index.d.ts  # TypeScript definitions for Prisma
│   │   │   ├── index.js    # Prisma client entry
│   │   │   └── prisma-schema.js  # Prisma schema file
│   └── utils               # Utility functions
│       └── emailUtils.js   # Email utility functions


```
## API-Documentation

### Register

**Endpoint:** `http://localhost:8383/`

**Method:** `POST`

**GraphQL Query:**

```graphql
mutation {
  register(password: "khhh##4QQWWFF123", email: "sam1@gmail.com") {
    success
    message
    user {
      id
      email
    }
  }
}

```
# Sample response 

```json
{
  "data": {
    "register": {
      "success": true,
      "message": "User created successfuly, here is your OTP 705453",
      "user": {
        "id": "cm1vz7p5100fr0786gu1dlfsk",
        "email": "sam1@gmail.com"
      }
    }
  }
}

```


### veryfy OTP

**Endpoint:** `http://localhost:8383/`

**Method:** `POST`

**GraphQL Query:**

```graphql
mutation {
  verifyOtp(email: "sam1@gmail.com", otp: "705453") {
    success
    message
  }
}


```
# Sample response 

```json
{
  "data": {
    "verifyOtp": {
      "success": true,
      "message": "OTP verified successfully."
    }
  }
}

```




### Login

**Endpoint:** `http://localhost:8383/`

**Method:** `POST`

**GraphQL Query:**

```graphql
mutation {
  login(password: "khhh##4QQWWFF123", email: "sam1@gmail.com") {
    success
    message
    token
    user {
      id
      email
    }
  }
}


```
# Sample success response 

```json
{
  "data": {
    "login": {
      "success": true,
      "message": "Login successful.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMXZ6N3A1MTAwZnIwNzg2Z3UxZGxmc2siLCJlbWFpbCI6InNhbTFAZ21haWwuY29tIiwiaWF0IjoxNzI4MTIyMDM3LCJleHAiOjE3MzA3MTQwMzd9.iwjqc7-OoUtUHZNTZAO4-fj_8bzqj5Y8_YaxAxsRGkc",
      "user": {
        "id": "cm1vz7p5100fr0786gu1dlfsk",
        "email": "sam1@gmail.com"
      }
    }
  }
}

```

# Sample Failed  response 

```json
{
  "data": {
    "login": {
      "success": false,
      "message": "Invalid email address or password.",
      "token": null,
      "user": null
    }
  }
}
```



### Request password reset

**Endpoint:** `http://localhost:8383/`

**Method:** `POST`

**GraphQL Query:**

```graphql
mutation {
  requestPasswordReset(email: "sam1@gmail.com"){
    message
    success
  }
}


```
# Sample response 

```json
{
  "data": {
    "requestPasswordReset": {
      "message": "Password reset email sent. here is the token sent eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMXZ6N3A1MTAwZnIwNzg2Z3UxZGxmc2siLCJlbWFpbCI6InNhbTFAZ21haWwuY29tIiwiaWF0IjoxNzI4MTIyMTEzLCJleHAiOjE3MjgxMjU3MTN9.d4RxcUupD_xpBnhoYfd5SVZ4u9_4KrOBGK8J59g8lAI",
      "success": true
    }
  }
}

```



### Reset password

**Endpoint:** `http://localhost:8383/`

**Method:** `POST`

**GraphQL Query:**

```graphql

mutation {
  resetPassword(
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMXZ6N3A1MTAwZnIwNzg2Z3UxZGxmc2siLCJlbWFpbCI6InNhbTFAZ21haWwuY29tIiwiaWF0IjoxNzI4MTIyMTEzLCJleHAiOjE3MjgxMjU3MTN9.d4RxcUupD_xpBnhoYfd5SVZ4u9_4KrOBGK8J59g8lAI",
    email: "sam1@gmail.com",
    newPassword: "68798s9sjYYYjsRRRTY(*RTGFHH)" 
  ) {
    success
    message
  }
}


```
# Sample response 

```json
{
  "data": {
    "resetPassword": {
      "success": true,
      "message": "Password reset successful."
    }
  }
}

```

