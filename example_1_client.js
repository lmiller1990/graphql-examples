const axios = require('axios')

axios.post('http://localhost:4000/graphql', {
  query: '{ language }'
})
  .then(res => console.log('res', res.data))
  .catch(err => console.log('err', err))
