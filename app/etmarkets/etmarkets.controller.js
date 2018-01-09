const etmarketsService = require('./etmarkets.service')
const _ = require('lodash')

const getNew52WeekStocks = async function (type) {

  const new52WeekStocks = await etmarketsService.getNew52WeekStocks(type)
  return new52WeekStocks.searchresult
}

const getNear52WeekStocks = async function (type) {

  const near52WeekStocks = await etmarketsService.getNear52WeekStocks(type)
  return near52WeekStocks.searchresult
}

const getHighPercentageStocks = async function () {

  const stocks = await etmarketsService.getPercentChangeStocks()
  return stocks.searchresult
}

module.exports = {
  getNew52WeekStocks,
  getNear52WeekStocks,
  getHighPercentageStocks
}