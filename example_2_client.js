const axios = require('axios')

axios.post('http://localhost:4444/graphql', {
  query: '{language}'
})
  .then(res => { console.log(res.data.data) })
  .catch(err => { console.log(err) })
