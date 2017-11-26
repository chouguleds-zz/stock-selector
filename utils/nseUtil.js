const htmlUtil = require('./htmlUtil')
const querystring = require('querystring')
const constants = require('./constants')
const httpUtil = require('./httpUtil')

const getPriceVolumeDeliverableData = function (companySymbol) {

  const url = constants.PRICE_VOLUME_DELIVERABLE_DATA_URL + '?' + querystring.stringify({

      symbol: companySymbol,
      segmentLink: 3,
      symbolCount: 1,
      series: 'ALL',
      dateRange: '1month',
      fromDate: null,
      toDate: null,
      dataType: 'PRICEVOLUMEDELIVERABLE'
    })
  const options = {

    method: 'GET',
    url: url,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
      'Connection':'keep-alive',
      'Cookie':'NSE-TEST-1=1826627594.20480.0000',
      'Host':'www.nseindia.com',
      'Referer':'https://www.nseindia.com/products/content/equities/equities/eq_security.htm',
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      'X-Requested-With':'XMLHttpRequest',
      'ExpectContinue' : false
    }
  }
  return httpUtil.makeRequest(options)
    .then(function (data) {

      return htmlUtil.scrapeTable(data)
    })
    .then(function (table) {

      return table[0]
    })
}

const _getFileName = function () {

  const date = new Date()

  let day = date.getDate()
  const weekDay = date.getDay()
  const currentHour = date.getHours()

  if (weekDay == 0) {

    day -= 2
  } else if (weekDay === 6) {

    day -= 1
  } else {

    if (currentHour < 16) {
      day -= 1
    }
  }

  if (day < 10) {
    day = '0' + day
  }
  day = '18'


  let month = date.getMonth() + 1 + ''

  if (month < 10) {
    month = '0' + month
  }

  const year = date.getFullYear()

  return 'CMVOLT_'+ day + month + year +'.CSV'
}


const getDailyVolatileStocks = function () {

  const fileName = _getFileName()
  const url = constants.DAILY_VOLATILITY_URL + fileName

  const options = {
    method: 'GET',
    url: url
  }

  return httpUtil.makeRequest(options)
    .then(function (data) {

      return data
    })
}

const getPreOpenMarketStocks = function () {

  const url = constants.DAILY_PRE_OPEN_MARKET_URL

  const options = {
    method: 'GET',
    url: url
  }

  return httpUtil.makeRequest(options)
    .then(function (data) {

      return data
    })
}

module.exports = {
  getPriceVolumeDeliverableData,
  getDailyVolatileStocks,
  getPreOpenMarketStocks
}