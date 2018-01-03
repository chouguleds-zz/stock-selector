const nseService = require('./nse.service')
const zerodhaController = require('../zerodha/zerodha.controller')
const _ = require('lodash')
const constants = require('../../utils/constants')

const _filterPreOpenMarketStocks = function (marginStocks, preOpenMarketStocks) {

  const filteredStocks = {}
    _.forEach(marginStocks, function (marginStock) {
      
      _.forEach(preOpenMarketStocks, function (preOpenMarketStock) {

        if (preOpenMarketStock.symbol === marginStock.symbol && preOpenMarketStock.price >= constants.MIN_STOCK_CLOSE_VALUE && preOpenMarketStock.price <= constants.MAX_STOCK_CLOSE_VALUE) {

          preOpenMarketStock.margin = marginStock.margin
          filteredStocks[preOpenMarketStock.symbol] = preOpenMarketStock
        }
      })
    })
  return filteredStocks
}

const formatPreOpenMarketStocks = function (stocks) {

  const preMarketOpenStocks = []
  _.forEach(stocks, function (data) {

    const stock = {}
    stock['symbol'] = data['symbol']
    stock['price'] = parseFloat(data['iep'].replace(/,/g , ''))
    stock['yesterdays close'] = parseFloat(data['pCls'].replace(/,/g , ''))
    stock['change'] = parseFloat(data['chn'].replace(/,/g , ''))
    stock['percentage change'] = parseFloat(data['perChn'].replace(/,/g , ''))
    stock['quantity'] = parseInt(data['trdQnty'].replace(/,/g , ''))
    stock['value in lakhs'] = parseFloat(data['iVal'].replace(/,/g , ''))
    stock['52 week high'] = parseFloat(data['yHigh'].replace(/,/g , ''))
    stock['52 week low'] = parseFloat(data['yLow'].replace(/,/g , ''))

    preMarketOpenStocks.push(stock)
  })
  return preMarketOpenStocks
}

const getPreOpenMarketStocks = async function () {

  let preOpenMarketStocks = null
  let marginStocks = null

  try {
    preOpenMarketStocks = await nseService.getPreOpenMarketStocks()
    preOpenMarketStocks = formatPreOpenMarketStocks(preOpenMarketStocks)
    marginStocks = await zerodhaController.getMarginStocks()
  } catch (err) {
    console.log(err)
  }
  return _filterPreOpenMarketStocks(marginStocks, preOpenMarketStocks)
}

const getVolumePriceDeliverableData = async function (symbol) {

  const stockData = await nseService.getPriceVolumeDeliverableData(symbol)
  return stockData
}

module.exports = {
  getPreOpenMarketStocks,
  getVolumePriceDeliverableData
}