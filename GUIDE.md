### Basics

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
  language: () => 'GraphQL'
}

// initialize the graphql server, and pass a `language` query
graphql(schema, '{ language }', rootValue).then(response => {
  console.log(response.data)
}).catch(err => {
  console.log('err', err)
})
```

Running `node example_2_server.js` should yield:

```
{ language: 'GraphQL' } 
```

### Use a HTTP client

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

`node example_1_client.js` should yield:

```
{ language: 'GraphQL' }
```

### Better Types

At the moment, are just returning a boring old String. In GraphQL, we can also have custom types. Let's define a new type, `Champion`.

We need to do two things:

1. Define the type name and fields in the Schema.
2. Create an ES6 class to handle the fields, methods, and so on.

Here is the type definition, and a simple Query to fetch a `Champion`.
```
const schema = buildSchema(`
  type Query {
    getChampion: Champion
  }

  type Champion {
    name: String!
    attackDamage: Int!
  }
`)
```

We can define an object to represent `Champion` using an ES6 class:

```
class Champion {
  constructor(name, attackDamage) {
    this.name = name
    this.attackDamage = attackDamage
  }
}

module.exports = Champion
```

Now we need an endpoint to response to the query. The query will initially return the `name` of the Champion. The query looks like this:

```
{
  getChampion {
    name
  }
}
```

And the endpoint:

```
const rootValue = {
  getChampion: () => new Champion('Ashe', 100)
}
```

Now in another file, `example_2_client.js`, we issue the query:


```
const axios = require('axios')

axios.post('http://localhost:4000/graphql', {
  query: `{ 
    getChampion { 
      name 
    } 
  }`
})
  .then(res => { console.log(res.data.data) })
  .catch(err => { console.log(err) })
```

Which yields:

```
{ getChampion: { name: 'Ashe' } }
```

Notice the response only contains `name` - what if we add `attackDamage` to the query?

```
{ getChampion: { name: 'Ashe', attackDamage: 100 } }
```

### Arguments


GraphQL lets us pass arguments to queries. In this case, let's see the updated query. 

```
const schema = buildSchema(`
  type Query {
    getChampion(name: String!): Champion
  }
}
```

We declare what arguments the query will receive, and the type. The `!` makes it required.

Let's see how we pass the arguments:

```
axios.post('http://localhost:4000/graphql', {
  query: `query GetChamp($name: String!) {
    getChampion(name: $name) {
      name
    }
  }`,
  variables: {
    name: 'Ashe'
  }
})
```

`query GetChamp($name: String!)` tells the query what variables we will be including. `GetChamp` is not required - but it's best practise to name the query on the client. We also include a `variables` object, containing the variables.

Let's expand our `getChampion` endpoint:


```
const champions = [
  new Champion('Ashe', 100),
  new Champion('Vayne', 200)
]

const rootValue = {
  getChampion: ({ name }) => {
    return champions.find(x => name === name)
  }
}
```

Any variables the query includes are passed as the first argument to the endpoint. We use ES6 destructuring to get the `name`, and find the correct champion from our array.

### Mutations

So far we have just been fetching data. Let's see how to update a record - or, in GraphQL, mutate a record. Let's see the updated client side request first:

```
axios.post('http://localhost:4000/graphql', {
  mutation: `mutation UpdateChamp($name: String!, $attackDamage: Int!) {
    updateChampion($name: name, $attackDamage: attackDamage)
      name
    }
  }`,
  variables: {
    name: 'Ashe',
    attackDamage: 500
  }
})
```

We are now passing a `mutation` instead of a `query`. The rest remains the same. Now the server:

```
const schema = buildSchema(`
  /* ... */
  type Mutation {
    updateChampion(name: String!, attackDamage: Int!): Champion
  }
`)

const rootValue = {
  /* */
  updateChampion: ({ name, attackDamage }) => {
    const champ = champions.find(x => name === name)
    champ.attackDamage = attackDamage

    return champ
  }
}
```
