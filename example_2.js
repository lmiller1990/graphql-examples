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

const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue
}))

app.listen(4444)
