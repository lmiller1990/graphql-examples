const express = require('express')
const {graphql, buildSchema} = require('graphql')
const graphqlHTTP = require('express-graphql')
const axios = require('axios')
const Champion = require('./champion')

const schema = buildSchema(`
  type Query {
    language: String 
    getChampion: Champion
  }

  type Champion {
    name: String!
    attackDamage: Int!
  }
`)

const champions = [
  new Champion('Ashe', 100),
  new Champion('Vayne')
]

const rootValue = {
  language: () => 'League of Legends',
  getChampion: () => champions[0]
}

const app = express()


app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}))

app.listen(4444)

axios.post('http://localhost:4444/graphql', {
  query: `{
    getChampion { 
      name 
      attackDamage
    }
  }` 
})
  .then(res => console.log(res.data.data))
  .catch(err => console.log(err.response.data))
