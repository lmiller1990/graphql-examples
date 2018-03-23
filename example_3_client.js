const axios = require('axios')

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
  .then(res => console.log(res.data))
  .catch(err => console.log(err))
