const axios = require('axios')

axios.post('http://localhost:4000/graphql', {
  query: `{ 
    getChampion { 
      name,
      attackDamage
    } 
  }`
})
  .then(res => { console.log(res.data.data) })
  .catch(err => { console.log(err) })
