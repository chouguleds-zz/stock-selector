const httpUtil = require('./httpUtil')
const htmlUtil = require('./htmlUtil')
const constants = require('./constants')
const _ = require('lodash')

const getMarginStockList = function () {

  const options = {
    url: constants.ZERODHA_MARGIN_STOCK_URL,
    method: 'GET'
  }
  return httpUtil.makeRequest(options)
    .then(function (data) {

      return htmlUtil.scrapeTable(data)
    })
    .then(function (table) {

      return _.flattenDeep(table[1])
    })
}

module.exports = {
  getMarginStockList
}