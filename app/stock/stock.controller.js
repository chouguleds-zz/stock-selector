const csv = require('fast-csv')
const fs = require('fs')
const _ = require('lodash')

const constants = require('../../utils/constants')
const httpUtil = require('../../utils/httpUtil')
const nseUtil = require('../../utils/nseUtil')
const zerodhaUtil = require('../../utils/zerodhaUtil')
const co = require('co')

const formatRow = function (data) {

  data['symbol'] = data['Symbol']
  data['yesterdays close'] = parseFloat(data['Underlying Previous Day Close Price (B)'])
  data['todays close'] = parseFloat(data['Underlying Close Price (A)'])
  data['yesterdays volatility'] = parseFloat(data['Previous Day Underlying Volatility (D)'])
  data['todays volatility'] = parseFloat(data['Current Day Underlying Daily Volatility (E) = Sqrt(0.94*D*D + 0.06*C*C)'])

  delete data.Date
  delete data['Symbol']
  delete data['Underlying Close Price (A)']
  delete data['Underlying Previous Day Close Price (B)']
  delete data['Previous Day Underlying Volatility (D)']
  delete data['Current Day Underlying Daily Volatility (E) = Sqrt(0.94*D*D + 0.06*C*C)']
  delete data['Underlying Annualised Volatility (F) = E*Sqrt(365)']
  delete data['Underlying Log Returns (C) = LN(A/B)']

  return data
}

const  process = function (data) {

  const row = formatRow(data)
  row['yesterdays volatility'] *= 100
  row['todays volatility'] *= 100

  return row
}

const isGoodStock = function (stock, priceVolumeDeliverableData) {

  if(!stock || !priceVolumeDeliverableData) {
    return false
  }

  if(!(stock['todays close'] >= constants.MIN_STOCK_CLOSE_VALUE && stock['todays close'] <= constants.MAX_STOCK_CLOSE_VALUE)) {
    return false
  }
  if (stock.symbol != priceVolumeDeliverableData[0].Symbol) {
    console.log("actual: " + stock.symbol + " false: "+priceVolumeDeliverableData[0].Symbol)
    return false
  }

  let isRecommendedStock = false
  const avgTradedVolume = _.meanBy(priceVolumeDeliverableData, function(o) { return parseInt(o['Total Traded Quantity'].replace(/,/g , '')) })
  const todaysVolume = parseInt(priceVolumeDeliverableData[priceVolumeDeliverableData.length - 1]['Total Traded Quantity'].replace(/,/g , ''))

  const avgPercentageDeliverableVolume =  _.meanBy(priceVolumeDeliverableData, function(o) { return parseFloat(o['% Dly Qt toTraded Qty']) })
  const todaysPercentageDeliverableVolume = parseFloat(priceVolumeDeliverableData[priceVolumeDeliverableData.length - 1]['% Dly Qt toTraded Qty'])

  const avgVolumePerTrade = _.meanBy(priceVolumeDeliverableData, function(o) { return parseInt(o['Total Traded Quantity'].replace(/,/g , '')) }) / _.meanBy(priceVolumeDeliverableData, function(o) { return parseInt(o['No. of Trades'].replace(/,/g , '')) })
  const avgIntradayVolumePerTrade = (avgVolumePerTrade - ((avgVolumePerTrade * avgPercentageDeliverableVolume) / 100))

  const todaysAvgVolumePerTrade = parseInt(priceVolumeDeliverableData[priceVolumeDeliverableData.length - 1]['Total Traded Quantity'].replace(/,/g , '')) / parseInt(priceVolumeDeliverableData[priceVolumeDeliverableData.length - 1]['No. of Trades'].replace(/,/g , ''))
  const todaysIntradayAvgVolumePerTrade = (todaysAvgVolumePerTrade - ((todaysAvgVolumePerTrade * todaysPercentageDeliverableVolume) / 100))

  if((avgTradedVolume >= constants.MIN_TOTAL_VOLUME || todaysVolume >=constants.MIN_TOTAL_VOLUME) &&
    (avgPercentageDeliverableVolume < constants.MAX_DELIVERABLE_STOCK_PERCENTAGE || todaysPercentageDeliverableVolume < constants.MAX_DELIVERABLE_STOCK_PERCENTAGE)) {

    stock['avg traded volume'] = avgTradedVolume
    stock['todays volume'] = todaysVolume
    stock['avg % deliverable volume'] = avgPercentageDeliverableVolume
    stock['todays % deliverable volume'] = todaysPercentageDeliverableVolume
    stock['avg intraday volume per trade'] = avgIntradayVolumePerTrade
    stock['todays intraday volume per trade'] = todaysIntradayAvgVolumePerTrade
    isRecommendedStock = true
  }
  return isRecommendedStock
}

const filterStocks = function* (stocks, filteredMarginStocks) {

  const filteredStocks = []
  let priceVolumeDeliverableData = null
  for (let i = 0; i < stocks.length; i++) {

    for (let j=0; j < filteredMarginStocks.length; j++) {

      let stock = stocks[i]
      let marginStock = filteredMarginStocks[j]
      if (stock.symbol === marginStock.symbol) {

        try {
          priceVolumeDeliverableData = yield nseUtil.getPriceVolumeDeliverableData(stock.symbol)
        } catch (err) {
          console.log(err)
        }

        if(isGoodStock(stock, priceVolumeDeliverableData)) {

          stock.margin = marginStock.margin
          filteredStocks.push(stock)

        }
      }
    }
  }

  return filteredStocks
}

const createStocks = function (volatileStocks, filteredMarginStocks) {

  let stocks = []
  const date = new Date()
  const fileName = '' + date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '.CSV'

  const writeStream = fs.createWriteStream(constants.STOCK_DIRECTORY_NAME +'/' + fileName)

  csv
    .fromString(volatileStocks, { headers: true })
    .on("data", function(row){

      stocks.push(process(row))
    })
    .on("end", function(){

      co.wrap(filterStocks)(stocks, filteredMarginStocks)
        .then(function (stocks) {

          stocks = _.orderBy(stocks, ['todays volatility'], ['desc']);
          csv
            .write(stocks, {
              headers: true
            })
            .pipe(writeStream)
        })
    })
}


const filterMarginStocks = function (stocks) {

  const marginStocks = []

  stocks.forEach(function (stock) {

    let margin = stock['_4']
    margin = margin.replace('x', '')

    if (parseInt(margin) >= constants.MIN_MARGIN_TO_TRADE) {

      const symbol = stock['_2'].split(':')[0]
      const filteredStock = {}
      filteredStock.symbol = symbol
      filteredStock.margin = margin
      marginStocks.push(filteredStock)
    }
  })
  return marginStocks
}

const getIntradayStocks = function* () {

  let marginStockList = null
  let dailyVolatileStocks = null

  try {
    marginStockList = yield zerodhaUtil.getMarginStockList()
    dailyVolatileStocks = yield nseUtil.getDailyVolatileStocks()
  } catch (err) {
    console.log(err)
  }

  const filteredMarginStocks = filterMarginStocks(marginStockList)
  return createStocks(dailyVolatileStocks, filteredMarginStocks)
}

const filterPreOpenMarketStocks = function (stocks, filteredMarginStocks) {

  const filteredStocks = []
  for (let i = 0; i < stocks.length; i++) {

    for (let j=0; j < filteredMarginStocks.length; j++) {

      let stock = stocks[i]
      let marginStock = filteredMarginStocks[j]
      if (stock.symbol === marginStock.symbol && stock.price >= constants.MIN_STOCK_CLOSE_VALUE && stock.price <= constants.MAX_STOCK_CLOSE_VALUE) {


          stock.margin = marginStock.margin
          filteredStocks.push(stock)
        }
      }
    }

  return filteredStocks
}

const formatPreOpenMarketStocksRow = function (data) {

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

  return stock
}

const createPreOpenMarketStocks = function (preOpenMarketStocks, filteredMarginStocks) {

  let stocks = []
  const date = new Date()
  const fileName = '' + date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '.CSV'

  const writeStream = fs.createWriteStream(constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME +'/' + fileName)

  preOpenMarketStocks.data.forEach(function (preOpenMarketStock) {

    stocks.push(formatPreOpenMarketStocksRow(preOpenMarketStock))
  })

  let preOpenStocks = filterPreOpenMarketStocks(stocks, filteredMarginStocks)
  preOpenStocks = _.orderBy(preOpenStocks, ['percentage change'], ['desc']);
  csv
    .write(preOpenStocks, {
      headers: true
    })
    .pipe(writeStream)
}

const getPreOpenMarketStocks = async function () {

  let marginStockList = null
  let preOpenMarketStocks = null

  try {
    marginStockList = await zerodhaUtil.getMarginStockList()
    preOpenMarketStocks = await nseUtil.getPreOpenMarketStocks()
  } catch (err) {
    console.log(err)
  }

  const filteredMarginStocks = filterMarginStocks(marginStockList)
  return createPreOpenMarketStocks(preOpenMarketStocks, filteredMarginStocks)
}
module.exports = {

  getIntradayStocks,
  getPreOpenMarketStocks
}