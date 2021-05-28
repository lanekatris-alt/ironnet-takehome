const { ApolloServer, gql } = require("apollo-server");
const rawLaunches = require("./spacex_launches.json");

const launches = rawLaunches.map(launch => ({
  name: launch.mission_name
}))

// This is the definition of the GraphQL schema
// How you structure this schema to fit the spacex_launches_data below
// along with how you write the code is the primary assessment
// Make input required?
const typeDefs = gql`
    
    type Query {
        launches(input: MissionsInput): [Launch]
    }
    
    input MissionsInput {
        name: String
    }
    
    type Launch {
        name: String!
    }
`;

// Resolvers define the technique for fetching the types defined in the schema.
// Launch: {
//   name: (launch) => launch.mission_name
// }

// Assuming name is there
const resolvers = {
  Query: {
    launches(parent, {input}, context, info) {
      const { name } = input || {};
      console.log({name})

      if (name) {
        return launches.filter(launch => launch.name.toLowerCase().includes(name))
      }

      return launches;
    }
  }


};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})

