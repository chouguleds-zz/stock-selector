const httpUtil = require('../../utils/httpUtil')
const constants = require('../../utils/constants')

const BASE_URL = 'https://admin.stockedge.com/'

const getDailyNews =  function () {

  const options = {
    method: 'GET',
    url: constants.STOCK_EDGE.DAILY_NEWS_URL
  }
  return httpUtil.makeRequest(options)
}

const getBreakoutStocks = function (period, type) {

  const options = {
    method: 'GET',
  }
  if (period === 'day' && type === 'high') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_DAY_HIGH_BREAKOUT_URL
  } else if (period === 'day' && type === 'low') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_DAY_LOW_BREAKOUT_URL
  } else if (period === 'week' && type === 'high') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_WEEK_HIGH_BREAKOUT_URL
  } else if (period === 'week' && type === 'low') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_WEEK_LOW_BREAKOUT_URL
  } else if (period === 'month' && type === 'high') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_MONTH_HIGH_BREAKOUT_URL
  } else if (period === 'month' && type === 'low') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_MONTH_LOW_BREAKOUT_URL
  } else if (period === '52week' && type === 'high') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_52_WEEK_HIGH_BREAKOUT_URL
  } else if (period === '52week' && type === 'low') {
    options.url = BASE_URL + constants.STOCK_EDGE.PRICE.PREVIOUS_52_WEEK_LOW_BREAKOUT_URL
  }
  return httpUtil.makeRequest(options)
}

const getCandlestickStocks = function (pattern) {

  const options = {
    method: 'GET',
  }

  if (pattern === 'neckline') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BULLISH.NECKLINE_URL
  } else if (pattern === 'upside tasuki gap') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BULLISH.UPSIDE_TASUKI_GAP_URL
  } else if (pattern === 'morning start') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BULLISH.MORNING_STAR_URL
  } else if (pattern === 'three white solders') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BULLISH.THREE_WHITE_SOLDIRES_URL
  } else if (pattern === 'downside tasuki gap') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BEARISH.DOWNSIDE_TASUKI_GAP_URL
  } else if (pattern === 'identical three crows') {
    options.url = BASE_URL + constants.STOCK_EDGE.CANDLESTICK.BEARISH.IDENTICAL_THREE_CROWS_URL
  }
  return httpUtil.makeRequest(options)
}

const getRsiStocks = function (type) {

  const options = {
    method: 'GET',
  }

  if (type === 'rsi bullish') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_BULLISH
  } else if (type === 'rsi trending up') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_TRENDING_UP
  } else if (type === 'rsi oversold') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_OVERSOLD
  } else if (type === 'rsi bearish') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_BEARISH
  } else if (type === 'rsi trending down') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_TRENDING_DOWN
  } else if (type === 'rsi overbought') {
    options.url = BASE_URL + constants.STOCK_EDGE.TECHNICAL.RSI.RSI_OVERBOUGHT
  }
  return httpUtil.makeRequest(options)
}

module.exports = {
  getDailyNews,
  getBreakoutStocks,
  getCandlestickStocks,
  getRsiStocks
}