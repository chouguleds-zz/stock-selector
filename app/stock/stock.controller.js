const csv = require('fast-csv')
const fs = require('fs')
const _ = require('lodash')
const co = require('co')

const chartinkController = require('../chartink/chartink.controller')
const mailUtil = require('../../utils/mailUtil')
const constants = require('../../utils/constants')
const nseController = require('../nse/nse.controller')
const etmarketsController =require('../etmarkets/etmarkets.controller')
const stockedgeController = require('../stockedge/stockedge.controller')
const zerodhaController = require('../zerodha/zerodha.controller')

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

const filterStocks = async function (stocks, filteredMarginStocks) {

  const filteredStocks = []
  let priceVolumeDeliverableData = null
  for (let i = 0; i < stocks.length; i++) {

    for (let j=0; j < filteredMarginStocks.length; j++) {

      let stock = stocks[i]
      let marginStock = filteredMarginStocks[j]
      if (stock.symbol === marginStock.symbol) {

        try {
          priceVolumeDeliverableData = await nseUtil.getPriceVolumeDeliverableData(stock.symbol)
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

// const createStocks = function (volatileStocks, filteredMarginStocks) {
//
//   let stocks = []
//   const date = new Date()
//   const fileName = '' + date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '.CSV'
//
//   const writeStream = fs.createWriteStream(constants.STOCK_DIRECTORY_NAME +'/' + fileName)
//
//   csv
//     .fromString(volatileStocks, { headers: true })
//     .on("data", function(row){
//
//       stocks.push(process(row))
//     })
//     .on("end", function(){
//
//       co.wrap(filterStocks)(stocks, filteredMarginStocks)
//         .then(function (stocks) {
//
//           stocks = _.orderBy(stocks, ['todays volatility'], ['desc']);
//           csv
//             .write(stocks, {
//               headers: true
//             })
//             .pipe(writeStream)
//         })
//     })
// }

const getIntradayStocks = async function () {

  let marginStockList = null
  let dailyVolatileStocks = null

  try {
    marginStockList = await zerodhaUtil.getMarginStockList()
    dailyVolatileStocks = await nseUtil.getDailyVolatileStocks()
  } catch (err) {
    console.log(err)
  }

  const filteredMarginStocks = filterMarginStocks(marginStockList)
  return createStocks(dailyVolatileStocks, filteredMarginStocks)
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

const _addScore = function (stock, score, scanner) {

  stock.score += score
  stock[scanner] = 1
}

const _getDayBreakoutStockScore = async function (stocks) {

  const dayHighBreakoutStocks = await stockedgeController.getBreakoutStocks('day', 'high')

  _.forEach(dayHighBreakoutStocks, function (dayHighBreakoutStock) {

    if(stocks[dayHighBreakoutStock.Symb] !== undefined) {
      const stock = stocks[dayHighBreakoutStock.Symb]
      if(!stock['week high breakout'] && !stock['month high breakout'] && !stock['52week high breakout'])
      _addScore(stocks[dayHighBreakoutStock.Symb], constants.SCREENER_WEIGHT.PRICE.BREAKOUT.DAY, 'day high breakout')
    }
  })

  const dayLowBreakoutStocks = await stockedgeController.getBreakoutStocks('day', 'low')

  _.forEach(dayLowBreakoutStocks, function (dayLowBreakoutStock) {

    if(stocks[dayLowBreakoutStock.Symb] !== undefined) {
      const stock = stocks[dayLowBreakoutStock.Symb]
      if(!stock['week low breakout'] && !stock['month low breakout'] && !stock['52week low breakout'])
      _addScore(stocks[dayLowBreakoutStock.Symb], -constants.SCREENER_WEIGHT.PRICE.BREAKOUT.DAY, 'day low breakout')
    }
  })
}

const _getWeekBreakoutStockScore = async function (stocks) {

  const weekHighBreakoutStocks = await stockedgeController.getBreakoutStocks('week', 'high')

  _.forEach(weekHighBreakoutStocks, function (weekHighBreakoutStock) {

    if(stocks[weekHighBreakoutStock.Symb] !== undefined) {
      const stock = stocks[weekHighBreakoutStock.Symb]
      if(!stock['month high breakout'] && !stock['52week high breakout'])
      _addScore(stocks[weekHighBreakoutStock.Symb], constants.SCREENER_WEIGHT.PRICE.BREAKOUT.WEEK, 'week high breakout')
    }
  })

  const weekLowBreakoutStocks = await stockedgeController.getBreakoutStocks('week', 'low')

  _.forEach(weekLowBreakoutStocks, function (weekLowBreakoutStock) {

    if(stocks[weekLowBreakoutStock.Symb] !== undefined) {
      const stock = stocks[weekLowBreakoutStock.Symb]
      if(!stock['month low breakout'] && !stock['52week low breakout'])
      _addScore(stocks[weekLowBreakoutStock.Symb], -constants.SCREENER_WEIGHT.PRICE.BREAKOUT.WEEK, 'week low breakout')
    }
  })
}

const _getMonthBreakoutStockScore = async function (stocks) {

  const monthHighBreakoutStocks = await stockedgeController.getBreakoutStocks('month', 'high')

  _.forEach(monthHighBreakoutStocks, function (monthHighBreakoutStock) {

    if(stocks[monthHighBreakoutStock.Symb] !== undefined) {
      const stock = stocks[monthHighBreakoutStock.Symb]
      if(!stock['52week high breakout'])
      _addScore(stocks[monthHighBreakoutStock.Symb], constants.SCREENER_WEIGHT.PRICE.BREAKOUT.MONTH, 'month high breakout')
    }
  })

  const monthLowBreakoutStocks = await stockedgeController.getBreakoutStocks('month', 'low')

  _.forEach(monthLowBreakoutStocks, function (monthLowBreakoutStock) {

    if(stocks[monthLowBreakoutStock.Symb] !== undefined) {
      const stock = stocks[monthLowBreakoutStock.Symb]
      if(!stock['52week low breakout'])
      _addScore(stocks[monthLowBreakoutStock.Symb], -constants.SCREENER_WEIGHT.PRICE.BREAKOUT.MONTH, 'month low breakout')
    }
  })
}

const _get52WeekBreakoutStockScore = async function (stocks) {

  const week52HighBreakoutStocks = await etmarketsController.getNew52WeekStocks('high')

  _.forEach(week52HighBreakoutStocks, function (week52HighBreakoutStock) {

    if(stocks[week52HighBreakoutStock.asiancercticker] !== undefined) {
      _addScore(stocks[week52HighBreakoutStock.asiancercticker], constants.SCREENER_WEIGHT.PRICE.BREAKOUT.WEEK52, '52week high breakout')
    }
  })

  const week52LowBreakoutStocks = await etmarketsController.getNew52WeekStocks('low')

  _.forEach(week52LowBreakoutStocks, function (week52LowBreakoutStock) {

    if(stocks[week52LowBreakoutStock.asiancercticker] !== undefined) {
      _addScore(stocks[week52LowBreakoutStock.asiancercticker], -constants.SCREENER_WEIGHT.PRICE.BREAKOUT.WEEK52, '52week low breakout')
    }
  })
}

const _getPriceBreakoutScore = async function (stocks) {

  try {
    await _get52WeekBreakoutStockScore(stocks)
    await _getMonthBreakoutStockScore(stocks)
    await _getWeekBreakoutStockScore(stocks)
    await _getDayBreakoutStockScore(stocks)
  } catch (err) {
    console.log(err)
  }
}

const _getCandlestickBullishScore = async function (stocks) {

  const necklineStocks = await stockedgeController.getCandlestickStocks('neckline')

  _.forEach(necklineStocks, function (necklineStock) {

    if(stocks[necklineStock.Symb] !== undefined) {
      _addScore(stocks[necklineStock.Symb], constants.SCREENER_WEIGHT.CANDLESTICK, 'bullish neckline')
    }
  })

  const upsideTasukiStocks = await stockedgeController.getCandlestickStocks('upside tasuki gap')

  _.forEach(upsideTasukiStocks, function (upsideTasukiStock) {

    if(stocks[upsideTasukiStock.Symb] !== undefined) {
      _addScore(stocks[upsideTasukiStock.Symb], constants.SCREENER_WEIGHT.CANDLESTICK, 'bullish upside tasuki gap')
    }
  })

  const morningStarStocks = await stockedgeController.getCandlestickStocks('morning start')

  _.forEach(morningStarStocks, function (morningStarStock) {

    if(stocks[morningStarStock.Symb] !== undefined) {
      _addScore(stocks[morningStarStock.Symb], constants.SCREENER_WEIGHT.CANDLESTICK, 'bullish morning start')
    }
  })

  const threeWhiteSoldersStocks = await stockedgeController.getCandlestickStocks('three white solders')

  _.forEach(threeWhiteSoldersStocks, function (threeWhiteSoldersStock) {

    if(stocks[threeWhiteSoldersStock.Symb] !== undefined) {
      _addScore(stocks[threeWhiteSoldersStock.Symb], constants.SCREENER_WEIGHT.CANDLESTICK, 'bullish three white solders')
    }
  })
}

const _getCandlestickBearishScore = async function (stocks) {

  const downsideTasukiStocks = await stockedgeController.getCandlestickStocks('downside tasuki gap')

  _.forEach(downsideTasukiStocks, function (downsideTasukiStock) {

    if(stocks[downsideTasukiStock.Symb] !== undefined) {
      _addScore(stocks[downsideTasukiStock.Symb], -constants.SCREENER_WEIGHT.CANDLESTICK, 'bearish downside tasuki gap')
    }
  })

  const identicalThreeCrowsStocks = await stockedgeController.getCandlestickStocks('identical three crows')

  _.forEach(identicalThreeCrowsStocks, function (identicalThreeCrowsStock) {

    if(stocks[identicalThreeCrowsStock.Symb] !== undefined) {
      _addScore(stocks[identicalThreeCrowsStock.Symb], -constants.SCREENER_WEIGHT.CANDLESTICK, 'bearish identical three crows')
    }
  })
}

const _getCandlestickScore = async function (stocks) {

  await _getCandlestickBullishScore(stocks)
  await _getCandlestickBearishScore(stocks)
}

const _getRsiScore = async function (stocks) {

  const rsiBullishStocks = await stockedgeController.getRsiStocks('rsi bullish')

  _.forEach(rsiBullishStocks, function (rsiBullishStock) {

    if(stocks[rsiBullishStock.Symb] !== undefined) {
      _addScore(stocks[rsiBullishStock.Symb], constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_BULLISH, 'rsi bullish')
    }
  })

  const rsiTrendingupStocks = await stockedgeController.getRsiStocks('rsi trending up')

  _.forEach(rsiTrendingupStocks, function (rsiTrendingupStock) {

    if(stocks[rsiTrendingupStock.Symb] !== undefined) {
      _addScore(stocks[rsiTrendingupStock.Symb], constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_TRENDING_UP, 'rsi trending up')
    }
  })

  const rsiOversoldStocks = await stockedgeController.getRsiStocks('rsi oversold')

  _.forEach(rsiOversoldStocks, function (rsiOversoldStock) {

    if(stocks[rsiOversoldStock.Symb] !== undefined) {
      _addScore(stocks[rsiOversoldStock.Symb], -constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_OVERSOLD, 'rsi oversold')
    }
  })

  const rsiBearishStocks = await stockedgeController.getRsiStocks('rsi bearish')

  _.forEach(rsiBearishStocks, function (rsiBearishStock) {

    if(stocks[rsiBearishStock.Symb] !== undefined) {
      _addScore(stocks[rsiBearishStock.Symb], -constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_BEARISH, 'rsi bearish')
    }
  })

  const rsiTrendingdownStocks = await stockedgeController.getRsiStocks('rsi trending down')

  _.forEach(rsiTrendingdownStocks, function (rsiTrendingdownStock) {

    if(stocks[rsiTrendingdownStock.Symb] !== undefined) {
      _addScore(stocks[rsiTrendingdownStock.Symb], -constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_TRENDING_DOWN, 'rsi trending down')
    }
  })

  const rsiOverboughtStocks = await stockedgeController.getRsiStocks('rsi overbought')

  _.forEach(rsiOverboughtStocks, function (rsiOverboughtStock) {

    if(stocks[rsiOverboughtStock.Symb] !== undefined) {
      _addScore(stocks[rsiOverboughtStock.Symb], constants.SCREENER_WEIGHT.TECHNICAL.RSI.RSI_OVERBOUGHT, 'rsi overbought')
    }
  })
}

const _getTechnicalScore = async function (stocks) {

  await _getRsiScore(stocks)
}

const _getNear52WeekScore = async function (stocks) {


  const near52WeekHighStocks = await etmarketsController.getNear52WeekStocks('high')

  _.forEach(near52WeekHighStocks, function (near52WeekHighStock) {

    if(stocks[near52WeekHighStock.asiancercticker] !== undefined && parseFloat(near52WeekHighStock.percentGap) <= 2) {
      _addScore(stocks[near52WeekHighStock.asiancercticker], constants.SCREENER_WEIGHT.PRICE.NEAR_52, 'near 52week high')
    }
  })

  const near52WeekLowStocks = await etmarketsController.getNear52WeekStocks('low')

  _.forEach(near52WeekLowStocks, function (near52WeekLowStock) {

    if(stocks[near52WeekLowStock.asiancercticker] !== undefined && parseFloat(near52WeekLowStock.percentGap) <= 2) {
      _addScore(stocks[near52WeekLowStock.asiancercticker], -constants.SCREENER_WEIGHT.PRICE.NEAR_52, 'near 52week low')
    }
  })
}

const _formatStocks = function (stocks) {

  const finalStocks = []
  _.forEach(stocks, function (data) {

    let stock = {}
    stock = _.merge(stock, data)

    delete stock['52 week high']
    delete stock['52 week low']
    delete stock['margin']
    delete stock['value in lakhs']

    stock['keys'] = Object.keys(data).length - 13
    stock['high gap close'] = data['high gap close']

    stock['52week high breakout'] = data['52week high breakout']
    stock['52week low breakout'] = data['52week low breakout']

    stock['near 52week high'] = data['near 52week high']
    stock['near 52week low'] = data['near 52week low']

    stock['three days high close'] = data['three days high close']
    stock['three days low close'] = data['three days low close']

    stock['month high breakout'] = data['month high breakout']
    stock['month low breakout'] = data['month low breakout']
    stock['week high breakout'] = data['week high breakout']
    stock['week low breakout'] = data['week low breakout']
    stock['day high breakout'] = data['day high breakout']
    stock['day low breakout'] = data['day low breakout']

    stock['bullish neckline'] = data['bullish neckline']
    stock['bullish upside tasuki gap'] = data['bullish upside tasuki gap']

    stock['bullish morning start'] = data['bullish morning start']
    stock['bullish three white solders'] = data['bullish three white solders']
    stock['bearish downside tasuki gap'] = data['bearish downside tasuki gap']

    stock['bearish identical three crows'] = data['bearish identical three crows']
    stock['rsi bullish'] = data['rsi bullish']
    stock['rsi trending up'] = data['rsi trending up']

    stock['rsi oversold'] = data['rsi oversold']
    stock['rsi bearish'] = data['rsi bearish']
    stock['rsi trending down'] = data['rsi trending down']
    stock['rsi overbought'] = data['rsi overbought']

    stock['gap high open'] = data['gap high open']
    stock['gap low open'] = data['gap low open']

    finalStocks.push(stock)
  })
  return finalStocks
}

const createStocks = function (stocks, orderField, orderDirection, dir, sendMail) {

  const date = new Date()
  const fileName = '' + date.getDate() + '_' + (date.getMonth() + 1) + '_' + date.getFullYear() + '.CSV'
  let cloned = stocks

  if (sendMail) {
    cloned = _formatStocks(stocks)
  }

  const writeStream = fs.createWriteStream(dir + '/' + fileName)
  cloned = _.orderBy(cloned, [orderField], [orderDirection]);

  csv
    .write(cloned, {
      headers: true
    })
    .pipe(writeStream)

  writeStream.on("finish", function(){

    if(sendMail) {

      mailUtil.sendMail(constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME +'/' + fileName, fileName)
    }
  })
}

const _getThreeDayCloseScore = async function (stocks) {

  const threeDayHighCloseStocks = await chartinkController.getThreeDaysCloseStocks('high')

  _.forEach(threeDayHighCloseStocks, function (threeDayHighCloseStock) {

    if(stocks[threeDayHighCloseStock.nsecode] !== undefined ) {
      _addScore(stocks[threeDayHighCloseStock.nsecode], constants.SCREENER_WEIGHT.CHARTINK.THREE_DAY_CLOSE, 'three days high close')
    }
  })

  const threeDayLowCloseStocks = await chartinkController.getThreeDaysCloseStocks('low')

  _.forEach(threeDayLowCloseStocks, function (threeDayLowCloseStock) {

    if(stocks[threeDayLowCloseStock.nsecode] !== undefined ) {
      _addScore(stocks[threeDayLowCloseStock.nsecode], -constants.SCREENER_WEIGHT.CHARTINK.THREE_DAY_CLOSE, 'three days low close')
    }
  })
}


const _getOpenPriceScore = function (stocks) {

  _.forEach(stocks, function (stock) {

    const pchange = stock['percentage change']

    if(pchange >= 5) {
      _addScore(stock, -4, 'gap high open')
    } else if(pchange <= -5) {
      _addScore(stock, 4, 'gap low open')
    }
  })
}

const _getPivotScore = async function (stocks) {

  for (let i = 0; i<stocks.length; i++) {

    const stockData = await nseController.getVolumePriceDeliverableData(stocks[i].symbol)
  }
}

const _getHighGapCloseScore = async function (stocks) {

  const highGapCloseStocks = await etmarketsController.getHighPercentageStocks()

  _.forEach(highGapCloseStocks, function (highGapCloseStock) {

    if(stocks[highGapCloseStock.asiancercticker] !== undefined ) {

      stocks[highGapCloseStock.asiancercticker].score += parseFloat(highGapCloseStock.percentChange)
      stocks[highGapCloseStock.asiancercticker]['high gap close'] = parseFloat(highGapCloseStock.percentChange)
    }
  })
}

const getStocks = async function () {

  try {

    let stocks = await nseController.getPreOpenMarketStocks()
    for (let key in stocks) {
      if (stocks.hasOwnProperty(key)) {
        stocks[key].score = 0
        stocks[key].keys = 0
      }
    }
    await _getPriceBreakoutScore(stocks)
    await _getCandlestickScore(stocks)
    await _getTechnicalScore(stocks)
    await _getNear52WeekScore(stocks)
    await _getThreeDayCloseScore(stocks)
    await _getHighGapCloseScore(stocks)

    const finalStocks = []
    for (let key in stocks) {
      if (stocks.hasOwnProperty(key)) {
        //stocks[key].keys = Object.keys(stocks[key]).length - 11
        finalStocks.push(stocks[key])
      }
    }
    //await _getPivotScore(finalStocks[0].symbol)

    _getOpenPriceScore(finalStocks)
    createStocks(finalStocks, 'score', 'desc', constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME, true)
  } catch (err) {
    console.log(err)
  }
}

const get15MinBreakoutStocks = async function () {

  let stocks = await chartinkController.get15MinBreakoutStocks()
  stocks = await zerodhaController.filterStocks(stocks, 'nsecode')
  createStocks(stocks, 'per_chg', 'desc', constants.BREAKOUT_15MIN_STOCKS_DIR_NAME, false)
}


module.exports = {

  getIntradayStocks,
  getStocks,
  get15MinBreakoutStocks
}