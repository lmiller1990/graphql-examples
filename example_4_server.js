const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const Champion = require('./champion')

const schema = buildSchema(`
  type Query {
    getChamp: Champion
  }

  type Mutation {
    updateChampion(name: String!, attackDamage: Int!): Champion
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
  updateChampion: ({ name, attackDamage }) => {
    const champion = champions.find(x => name === name)
    champion.attackDamage = attackDamage

    return champion
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema, rootValue, graphiql: true
}))

app.listen(4000, () => console.log('Listening on port 4000'))
