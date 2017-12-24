const constants = {}

constants.DAILY_VOLATILITY_URL = 'https://www.nseindia.com/archives/nsccl/volt/'
constants.DAILY_PRE_OPEN_MARKET_URL = 'https://www.nseindia.com/live_market/dynaContent/live_analysis/pre_open/all.json'
constants.STOCK_DIRECTORY_NAME = 'selected_stocks'
constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME = 'pre_open_market_stocks'
constants.ZERODHA_MARGIN_STOCK_URL = 'https://zerodha.com/margin-calculator/Equity/'
constants.PRICE_VOLUME_DELIVERABLE_DATA_URL = 'https://www.nseindia.com/products/dynaContent/common/productsSymbolMapping.jsp'
constants.MIN_MARGIN_TO_TRADE = 0
constants.MIN_STOCK_CLOSE_VALUE = 50
constants.MAX_STOCK_CLOSE_VALUE = 600
constants.MIN_TOTAL_VOLUME = 500000
constants.MAX_DELIVERABLE_STOCK_PERCENTAGE = 40
constants.BLUE_MIX = {
  TONE_ANALYSER_URL: 'https://tone-analyzer-demo.ng.bluemix.net/api/tone'
}
constants.FEATURE_TOGGLE = {
  INTRADAY_STOCK_SELECTION: false,
  PRE_OPEN_MARKET_STOCKS_SELECTION: false
}

module.exports = constants