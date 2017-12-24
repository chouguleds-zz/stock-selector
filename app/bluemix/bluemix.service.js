const httpUtil = require('../../utils/httpUtil')
const constants = require('../../utils/constants')

const getSentiment = function (text) {

  const options = {
    method: 'POST',
    url: constants.BLUE_MIX.TONE_ANALYSER_URL,
    data: {
      text: text,
      language: 'en'
    }
  }
  return httpUtil.makeRequest(options)
}

module.exports = {
  getSentiment
}