import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from 'graphql-tools';

const __dirname = path.resolve();

const schemaFilePath = path.join(__dirname, 'src/schema.graphql');
const typeDefs = fs.readFileSync(schemaFilePath, 'utf-8');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/users.json'), 'utf-8'));

// Define resolvers
const resolvers = {
    Query: {
      getUsers: () => data.users,
    },
  };  

  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    schema: addMocksToSchema({
        schema: makeExecutableSchema({typeDefs, resolvers }),
    }),
});
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);