const httpUtil = require('../../utils/httpUtil')
const constants = require('../../utils/constants')
const qs = require('querystring')

const getThreeDaysCloseStocks = function (type) {

  const options = {
    method: 'POST',
    url: constants.CHARTINK.BASE,
    headers: constants.CHARTINK.HEADERS
  }

  if(type === 'high'){

    options.data = qs.stringify({
      'scan_clause': constants.CHARTINK.SCAN_CLAUSE.THREE_DAY_HIGH_CLOSE
    })
  } else if(type === 'low') {

    options.data = qs.stringify({
      'scan_clause': constants.CHARTINK.SCAN_CLAUSE.THREE_DAY_LOW_CLOSE
    })
  }

  return httpUtil.makeRequest(options)
}

const get15MinBreakoutStocks = function () {

  const options = {
    method: 'POST',
    url: constants.CHARTINK.BASE,
    headers: constants.CHARTINK.HEADERS
  }
  options.headers.referer = 'https://chartink.com/screener/15-minute-stock-breakouts'

  options.data = qs.stringify({
    'scan_clause': constants.CHARTINK.SCAN_CLAUSE.BREAKOUT_15_MIN
  })

  return httpUtil.makeRequest(options)
}
module.exports = {
  getThreeDaysCloseStocks,
  get15MinBreakoutStocks
}