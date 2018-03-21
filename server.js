const express = require('express')
const {graphql, buildSchema} = require('graphql')
const graphqlHTTP = require('express-graphql')

const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int!): [Int]
    getDie(numSides: Int): RandomDie
  }

  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }
`)

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll({ numRolls }) {
    const output = []

    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }

    return output
  }
}


const rootValue = {
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6)
  },

  roll: ({ numRolls }) => {
    return 10
  },

  rollDice: ({ numDice, numSides }) => {
    const dice = []

    for (let i = 0; i < numDice; i++) {
      dice.push(1 + Math.floor(Math.random() * numSides))
    }

    return dice
  }
}

graphql(schema, '{test}', rootValue).then(res => {
  console.log('res', res.data)
})

const app = express()

app.use('/graphql', graphqlHTTP({
  schema, rootValue, graphiql: true
}))

app.listen(4444)
