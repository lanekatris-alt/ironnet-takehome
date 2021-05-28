# Cloud Application Engineer Challenge

## Challenge

Using your favorite language, implement a GraphQL server that would allow a UI developer to query SpaceX's launch data. The UI Developer will be most interested in querying the mission name, launch date, and the norad ids of the payloads on board the rocket. The focus of this assignment is assessing how you create a useful graphQL schema against the data and how understandable your code is.

You should use the launch data that is attached as spacex_launches.json. The data from spacex_launches.json can be stored directly in memory; do not worry about adding a database or other storage mechanism beyond direct variable access.

If you have time, add additional fields and queries to your graphQL server based off of the data in spacex_launches.json and add relevant testing and logging to your working server.

## Sample Scaffold

You can implement this GraphQL server using whatever framework or programming language you would like. However, we do include a bare bones javascript file that utilizes [Apollo Server](https://www.apollographql.com/docs/apollo-server/getting-started/) and nodeJS for the assignment only for convenience. Note, to use this scaffolding, you will need to issue `npm install` inside of the folder.

If you would prefer to use an online IDE, there is a pre-made Apollo Server scaffold available - https://codesandbox.io/s/apollo-server-apollo-server

## What's provided

- This README file
- spacex_launches.json - raw data that should be queried
- index.js - a graphQL server scaffolding implemented using Apollo Server
- package.json - node modules needed to create a GraphQL Apollo Server

## GraphQL

Explanation and code samples can be found https://graphql.org/code/

Apollo Server is explained here - https://www.apollographql.com/docs/apollo-server/getting-started/

## Data Explanation

The section below is pasted from spacex_launches.json for the first launch. The comments next to the fields give a background on what the field means.

```javascript
[
  {
    flight_number: 90,
    mission_name: "Starlink 4", // Mission Name the UI Developer will need to query
    launch_date_unix: 1581951955, // The Launch Date in standard unix epoch time the UI Developer will need to query
    rocket: {
      rocket_id: "falcon9",
      payloads: [
        {
          payload_id: "Starlink 4",
          norad_id: [
            // A list of the Norad Ids of the payload on the rocket that the UI Developer will need to query
            45341,
          ],
        },
      ],
    },
    launch_site: {
      site_id: "ccafs_slc_40",
      site_name: "CCAFS SLC 40",
      site_name_long:
        "Cape Canaveral Air Force Station Space Launch Complex 40",
    },
    launch_success: true,
  },
];
```

## Delivery medium

Please include directions on how to run your software. Your code can be submitted in any of the following ways:

a) URL to a sandbox on https://codesandbox.io,

b) URL to a remote git repository (e.g. GitHub or GitLab),

c) ZIP archive with source files

## Time limit

Spend at most approximately three hours on this task. Your submissions will be evaluated on the quality of the graphQL schema, how understandable your code is, and if your server runs. Completed, production code is not required.
