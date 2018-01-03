const _ = require('lodash')
const stockedgeService = require('./stockedge.service')

const getDailyNews = async function () {

  const dailyNews = await stockedgeService.getDailyNews()
  return dailyNews
}

const getBreakoutStocks = async function (period, type) {

  const weekHighBreakoutStocks = await stockedgeService.getBreakoutStocks(period, type)
  return weekHighBreakoutStocks
}


const getCandlestickStocks = async function (pattern) {

  const candlestickStocks = await stockedgeService.getCandlestickStocks(pattern)
  return candlestickStocks
}

const getRsiStocks = async function (type) {

  const rsiStocks = await stockedgeService.getRsiStocks(type)
  return rsiStocks
}

module.exports = {
  getDailyNews,
  getBreakoutStocks,
  getCandlestickStocks,
  getRsiStocks
}