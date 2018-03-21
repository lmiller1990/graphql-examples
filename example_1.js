/**
 * GraphQL is a query language for your API, and a server side runtime for executing queries. A GraphQL service is created by defining types and fields, then providing   functions for each field on each type. The canonical example from the GraphQL documentation is:
 *
 * type Query { // define the query
 *   me: User   // define the fields
 * }
 *
 * type User {  // define the type
 *   id: ID
 *   name: String
 * }
 *
 * function Query_me(request) { // define the function
 *   return request.auth.user
 * }
 *
 * and a sample query looks like this:
 *
 * {
 *   me {
 *       name
 *   }
 * }
 *
 * which returns:
 *
 * {
 *   "me": {
 *     "name": "username"
 *   }
 * }
 *
 *
 * Before going any further, let's see some actual code.
 */

const express = require('express')
const {graphql, buildSchema} = require('graphql')
const graphqlHTTP = require('express-graphql')

const schema = buildSchema(`
  type Query {
    language: String 
  }
`)

const rootValue = {
  language: () => 'League of Legends'
}

graphql(schema, '{ language }', rootValue).then(response => {
  console.log(response.data)
}).catch(err => {
  console.log('err', err)
})
