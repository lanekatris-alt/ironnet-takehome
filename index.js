const getNoradIdsFromLaunch = require('./norad-ids-from-launch')
const { ApolloServer, gql } = require('apollo-server')
const moment = require('moment')

const rawLaunches = require('./spacex_launches.json')
const launches = rawLaunches.map(launch => ({
  launch_date_friendly: moment.unix(launch.launch_date_unix).toLocaleString(),
  ...launch
}))

// I decided to not support time, just date, I didn't think launches happened a ton of times on the same day
// I'm not a fan of snake case but decided to stick with the data format
// I didn't see a reason to add all the values from data and focused on filtering and type shapes
// Normally I would split up this file if it got any bigger but no reason for this project
const typeDefs = gql`
    # Normally I would make the input required always but it does make the endpoint easy to use by not requiring it to be passed in and expecting all to be returned (hence the comment in schema)
    type Query {
        "Returns all launches if no input provided"
        launches(input: MissionsInput): [Launch]
    }
    
    input MissionsInput {
        "Partial or full mission name (not case sensitive)"
        mission_name: String
        "YYYY-MM-DD date format (no time)"
        start_date: String
        "YYYY-MM-DD date format (no time)"
        end_date: String
        norad_ids: [Int]
    }
    
    type Launch {
        mission_name: String
        "Unix epoch time"
        launch_date_unix: Int
        launch_date_friendly: String # # This is just to be easier to know the date probably shouldn't be left on the graph
        rocket: Rocket
    }
    
    type Rocket {
        payloads: [RocketPayload]
    }

    type RocketPayload {
        norad_id: [Int]
    }
`

const resolvers = {
  Query: {
    launches(_, { input }) {
      // I'm assuming if date(s) are provided they are in the proper format 🤷‍♂️
      const { mission_name, start_date, end_date, norad_ids } = input || {}
      console.log('Your input', input)

      let filteredLaunches = launches; // Not the safest but not altering our source variable

      if (mission_name) {
        filteredLaunches = filteredLaunches.filter(launch => launch.mission_name.toLowerCase().includes(mission_name))
      }

      if (start_date) {
        const _startDate = moment(start_date)
        const _endDate = end_date ? moment(end_date) : _startDate

        filteredLaunches = filteredLaunches.filter(launch => {
          const launchDate = moment.unix(launch.launch_date_unix)
          return launchDate.isBetween(_startDate, _endDate, 'days', '[]')
        })
      }

      if (norad_ids && norad_ids.length > 0) {
        filteredLaunches = filteredLaunches.filter(launch => {
          const foundNoradIds = getNoradIdsFromLaunch(launch)
          return norad_ids.some(id => foundNoradIds.includes(id))
        })
      }

      if (norad_ids && norad_ids.length === 0) {
        filteredLaunches = filteredLaunches.filter(launch => {
          return getNoradIdsFromLaunch(launch).length === 0
        })
      }

      return filteredLaunches
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

