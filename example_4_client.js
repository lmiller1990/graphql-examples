const axios = require('axios')

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
  .then(res => console.log(res.data))
  .catch(err => console.log(err))
