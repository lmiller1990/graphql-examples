 GraphQL is a query language for your API, and a server side runtime for executing queries. A GraphQL service is created by defining types and fields, then providing   functions for each field on each type. The canonical example from the GraphQL documentation is:
 
type Query { // define the query
  me: User   // define the fields
}

type User {  // define the type
  id: ID
  name: String
}

function Query_me(request) { // define the function
  return request.auth.user
}
 
and a sample query looks like this:
{
  me {
    name
  }
}

which returns:

{
  "me": {
    "name": "username"
  }
}

Before going any further, let's see some actual code. We need to create a new node project:

```
npm init -y
npm install express graphql express-graphql --save
touch index.js
```

```
const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')

// build the schema, im which we define the query, and fields with types
// this is a language query that returns a String
const schema = buildSchema(`
  type Query {
    language: String 
  }
`)

// The single endpoint, which resolves an incoming query to the correct function
const rootValue = {
  language: () => 'League of Legends'
}

// initialize the graphql server, and pass a `language` query
graphql(schema, '{ language }', rootValue).then(response => {
  console.log(response.data)
}).catch(err => {
  console.log('err', err)
})
```

Running `node index.js` should yield:

```
{ language: 'League of Legends' } 
```

Most of the time, a query will come from an AJAX request. Let's see how to do the above, with `axios`. 

```
npm install axios --save
```

```
const axios = require('axios')

axios.post('http://localhost:4444/graphql', {
  query: '{language}'
})
  .then(res => console.log('result:', res.data.data))
  .catch(err => console.log(err))
```

`node client.js` should yield:

```
{ language: 'League of Legends' }
```
