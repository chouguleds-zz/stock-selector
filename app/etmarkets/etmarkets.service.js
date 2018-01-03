const httpUtil = require('../../utils/httpUtil')
const constants = require('../../utils/constants')

const getNear52WeekStocks = function (type) {

  const options = {
    method: 'GET'
  }

  if(type === 'high'){
    options.url = constants.ET_MARKETS.PRICE.NEAR_52_WEEK_HIGH
  } else if(type === 'low') {
    options.url = constants.ET_MARKETS.PRICE.NEAR_52_WEEK_LOW
  }

  return httpUtil.makeRequest(options)
}

const getNew52WeekStocks = function (type) {

  const options = {
    method: 'GET'
  }

  if(type === 'high'){
    options.url = constants.ET_MARKETS.PRICE.NEW_52_WEEK_HIGH
  } else if(type === 'low') {
    options.url = constants.ET_MARKETS.PRICE.NEW_52_WEEK_LOW
  }
  return httpUtil.makeRequest(options)
}

const getPercentChangeStocks = function () {

  const options = {
    method: 'GET'
  }

  options.url = constants.ET_MARKETS.PERCENT_CHANGE
  return httpUtil.makeRequest(options)
}

module.exports = {
  getNear52WeekStocks,
  getNew52WeekStocks,
  getPercentChangeStocks
}