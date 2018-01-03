const stockController = require('./app/stock/stock.controller')
const constants = require('./utils/constants')
const co = require('co')
const fs = require('fs')

require('./utils/mailUtil')

const preOpenDirectory = './' + constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME
const intradayStockDirectory = './' + constants.STOCK_DIRECTORY_NAME
const breakout15MinStockDir = './' + constants.BREAKOUT_15MIN_STOCKS_DIR_NAME

if (!fs.existsSync(breakout15MinStockDir)){
  fs.mkdirSync(breakout15MinStockDir)
}

if (!fs.existsSync(preOpenDirectory)){
  fs.mkdirSync(preOpenDirectory)
}

if (!fs.existsSync(intradayStockDirectory)){
  fs.mkdirSync(intradayStockDirectory)
}

if (constants.FEATURE_TOGGLE.INTRADAY_STOCK_SELECTION) {
  co.wrap(stockController.getIntradayStocks)()
}
if(constants.FEATURE_TOGGLE.PRE_OPEN_MARKET_STOCKS_SELECTION) {
  co.wrap(stockController.getPreOpenMarketStocks)()
}

//co.wrap(stockController.get15MinBreakoutStocks)()

co.wrap(stockController.getStocks)()



return
