const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const Champion = require('./champion')

const schema = buildSchema(`
  type Query {
    getChampion: Champion
  }

  type Champion {
    name: String!
    attackDamage: Int!
  }
`)

const rootValue = {
  getChampion: () => new Champion('Ashe', 100)
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema, rootValue
}))

app.listen(4000)
