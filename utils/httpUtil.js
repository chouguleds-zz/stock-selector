const axios = require('axios');

const makeRequest = function (options) {

  return axios(options)
  .then(function (result) {

    return result.data
  })
}

module.exports = {
  makeRequest: makeRequest
}