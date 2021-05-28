const copy = require('./copy');
const getNoradIdsFromLaunch = require('./norad-ids-from-launch');
const { ApolloServer, gql } = require('apollo-server');
const moment = require('moment');

const rawLaunches = require('./spacex_launches.json');
const launches = rawLaunches.map(launch => ({
  name: launch.mission_name,
  launchDateUnix: launch.launch_date_unix,
  launchDateIso: moment.unix(launch.launch_date_unix).toISOString(),
  launchDateFriendly: moment.unix(launch.launch_date_unix).toLocaleString(),

  // rocket: launch.rocket
  ...launch
}))

// This is the definition of the GraphQL schema
// How you structure this schema to fit the spacex_launches_data below
// along with how you write the code is the primary assessment
// Make input required?
// Any kind of date fields in teh graph its nice to say the format
// I decided to not support time, just date, I didn't think launches happened a ton of times on the same day
const typeDefs = gql`
    # Normally I would make the input required always but it does make the endpoint easy to use by not requiring it to be passed in and expecting all to be returned (hence the comment in schema)
    type Query {
        "Returns all launches if no input provided"
        launches(input: MissionsInput): [Launch]
    }
    
    input MissionsInput {
        name: String
        "YYYY-MM-DD date format (no time)"
        startDate: String
        "YYYY-MM-DD date format (no time)"
        endDate: String
        noradIds: [Int]
    }
    
    type Launch {
        name: String
        "Unix epoch time"
        launchDateUnix: Int
        "ISO format"
        launchDateIso: String # This is just to be easier to know the date; probably shouldn't be left on the graph
        launchDateFriendly: String
        
        rocket: Rocket
    }
    
    type Rocket {
        payloads: [RocketPayload]
    }

    type RocketPayload {
        norad_id: [Int]
    }
`;

const resolvers = {
  Query: {
    launches(_, { input }) {
      // I'm assuming if date(s) are provided in the proper format 🤷‍♂️
      const { name, startDate, endDate, noradIds } = input || {};
      console.log(input)

      // TODO: Does this actually edit it for everybody?
      let filteredLaunches = copy(launches); // Don't alter our variable that requests share

      if (name) {
        filteredLaunches = filteredLaunches.filter(launch => launch.name.toLowerCase().includes(name))
      }

      if (startDate) {
        const _startDate = moment(startDate);
        const _endDate = endDate ? moment(endDate) : _startDate;

        filteredLaunches = filteredLaunches.filter(launch => {
          const launchDate = moment.unix(launch.launchDateUnix)
          return launchDate.isBetween(_startDate, _endDate, 'days', '[]')
        })
      }

      if (noradIds && noradIds.length > 0) {
        filteredLaunches = filteredLaunches.filter(launch => {
          const foundNoradIds = getNoradIdsFromLaunch(launch)
          return noradIds.some(id => foundNoradIds.includes(id));
        })
      }

      if (noradIds && noradIds.length === 0) {
        filteredLaunches = filteredLaunches.filter(launch => {
          return getNoradIdsFromLaunch(launch).length === 0
        })
      }

      return filteredLaunches;
    }
  }


};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})

