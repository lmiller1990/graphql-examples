const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const Champion = require('./champion')

const schema = buildSchema(`
  type Query {
    getChampion(name: String!): Champion
  }

  type Champion {
    name: String!
    attackDamage: Int!
  }
`)

const champions = [
  new Champion('Ashe', 100),
  new Champion('Vayne', 200)
]

const rootValue = {
  getChampion: ({ name }) => {
    return champions.find(x => name === name)
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema, rootValue, graphiql: true
}))

app.listen(4000)
