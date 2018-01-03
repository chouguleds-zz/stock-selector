const _ = require('lodash')
const zerodhaService = require('./zerodha.service')
const Promise = require('bluebird')
let marginStocks

const getMarginStocks = async function () {


  if(marginStocks){
    return new Promise(function (resolve) {
     return resolve(marginStocks)
    })
  }
  marginStocks = []
  const stocks = await zerodhaService.getMarginStockList()

  stocks.forEach(function (stock) {

    let margin = stock['_4']
    margin = margin.replace('x', '')
    const symbol = stock['_2'].split(':')[0]
    const filteredStock = {}
    filteredStock.symbol = symbol
    filteredStock.margin = margin
    marginStocks.push(filteredStock)

  })
  return marginStocks
}

const filterStocks = async function (stocks, symbolField) {

  const filteredStocks = []
  const marginStocks = await getMarginStocks()

  _.forEach(marginStocks, function (marginStock) {

    _.forEach(stocks, function (stock) {

      if (stock[symbolField] === marginStock.symbol) {

        filteredStocks.push(stock)
      }
    })
  })
  return filteredStocks
}

module.exports = {
  getMarginStocks,
  filterStocks
}