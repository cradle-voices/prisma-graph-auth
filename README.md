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

