const axios = require('axios')
const qs = require('querystring')

function rollDice ()  {
  axios.post('http://localhost:4444/graphql', {
    query: `query RollDice($numDice: Int!, $numSides: Int!) {
      rollDice(numDice: $numDice, numSides: $numSides)
    }`,

    variables: { 
      numDice: 4,
      numSides: 10
    }
  })
    .then(res => console.log(res.data.data))
    .catch(err => console.log(err))
}

/**
 * name the query. Tell the query what variables and types to get.
 * ask for result
 */
function randomDie () {
  axios.post('http://localhost:4444/graphql', {
    query: `query GetDie($numSides: Int!) {
      getDie(numSides: $numSides) {
        rollOnce
        roll(numRolls: 3)
      }
    }`,
    
    variables: {
      numSides: 12
    }
  })
    .then(res => console.log(res.data.data))
    .catch(err => console.log(err))
}

// rollDice()

randomDie()
