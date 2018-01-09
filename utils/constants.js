const constants = {}

constants.DAILY_VOLATILITY_URL = 'https://www.nseindia.com/archives/nsccl/volt/'
constants.DAILY_PRE_OPEN_MARKET_URL = 'https://www.nseindia.com/live_market/dynaContent/live_analysis/pre_open/all.json'
constants.STOCK_DIRECTORY_NAME = 'selected_stocks'
constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME = 'pre_open_market_stocks'
constants.BREAKOUT_15MIN_STOCKS_DIR_NAME = 'breakout_fifteen_min_stocks'
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

constants.STOCK_EDGE = {
  PRICE: {
    DAILY_NEWS_URL: 'Api/DailyDashboardApi/GetLatestNewsitems',
    PREVIOUS_DAY_HIGH_BREAKOUT_URL: 'Api/AlertsApi/GetClosingAbovePreviousHighSavedAlerts',
    PREVIOUS_DAY_LOW_BREAKOUT_URL: 'Api/AlertsApi/GetClosingBelowPreviousLowSavedAlerts',
    PREVIOUS_WEEK_HIGH_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossingLastWeekHighSavedAlerts',
    PREVIOUS_WEEK_LOW_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossingLastWeekLowSavedAlerts',
    PREVIOUS_MONTH_HIGH_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossingLastMonthHighSavedAlerts',
    PREVIOUS_MONTH_LOW_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossingLastMonthLowSavedAlerts',
    PREVIOUS_52_WEEK_HIGH_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossing52WeekHighSavedAlerts',
    PREVIOUS_52_WEEK_LOW_BREAKOUT_URL: 'Api/AlertsApi/GetCloseCrossing52WeekLowSavedAlerts',
  },
   CANDLESTICK: {
    BULLISH: {
      NECKLINE_URL: 'api/alertsapi/GetNeckLineSavedAlerts/',
      UPSIDE_TASUKI_GAP_URL: 'api/alertsapi/GetUpsideTasukiGapSavedAlerts/',
      MORNING_STAR_URL: 'api/alertsapi/GetMorningStarSavedAlerts/',
      THREE_WHITE_SOLDIRES_URL: 'api/alertsapi/GetThreeWhiteSoldiersSavedAlerts/',
    },
    BEARISH: {
      DOWNSIDE_TASUKI_GAP_URL: 'api/alertsapi/GetDownsideTasukiGapSavedAlerts/',
      IDENTICAL_THREE_CROWS_URL: 'api/alertsapi/GetIdentiticalThreeCrowsSavedAlerts/'
    }
   },
  TECHNICAL: {
    RSI: {
      RSI_BULLISH: 'Api/AlertsApi/GetRSIBullishSavedAlerts/',
      RSI_TRENDING_UP: 'Api/AlertsApi/GetRSITrendingUpSavedAlerts/',
      RSI_OVERSOLD: 'Api/AlertsApi/GetRSIOverSoldSavedAlerts/',
      RSI_BEARISH: 'Api/AlertsApi/GetRSIBearishSavedAlerts/',
      RSI_TRENDING_DOWN: 'Api/AlertsApi/GetRSITrendingDownSavedAlerts/',
      RSI_OVERBOUGHT: 'Api/AlertsApi/GetRSIOverBoughtSavedAlerts/'
    }
  }
}

constants.ET_MARKETS = {

  PRICE: {
    NEAR_52_WEEK_HIGH: 'https://json.bselivefeeds.indiatimes.com/ET_Community/Near52WeeksHigh?pid=7&pageno=1&pagesize=2000&sortby=percentgap&sortorder=asc&exchange=50',
    NEAR_52_WEEK_LOW: 'https://json.bselivefeeds.indiatimes.com/ET_Community/Near52WeeksLow?pid=8&pageno=1&pagesize=2000&sortby=percentgap&sortorder=asc&exchange=50',
    NEW_52_WEEK_HIGH: 'https://json.bselivefeeds.indiatimes.com/ET_Community/New52WeeksHigh?pid=5&pageno=1&pagesize=2000&sortby=percentchange&sortorder=desc&exchange=50',
    NEW_52_WEEK_LOW: 'https://json.bselivefeeds.indiatimes.com/ET_Community/New52WeeksLow?pid=6&pageno=1&pagesize=2000&sortby=percentchange&sortorder=asc&exchange=50'
  },
  PERCENT_CHANGE: 'https://json.bselivefeeds.indiatimes.com/ET_Community/BuyerSellerMover?pagesize=2000&pid=3&exchange=50&pageno=1&service=valuemovers&sortby=percentchange&sortorder=desc'
}

constants.CHARTINK = {
  BASE: 'https://chartink.com/screener/process',
  HEADERS: {
    'postman-token': '60de257a-ed14-d4c9-cd22-2618dc4f228a',
    'cache-control': 'no-cache',
    'cookie': '_ga=GA1.2.2004862449.1514294143; _gid=GA1.2.1908416860.1514294143; gsScrollPos-608=0; XSRF-TOKEN=eyJpdiI6IlwvYmVzaWtVZnFhS3hQSUJ6UVVQNTJ3PT0iLCJ2YWx1ZSI6InhrTFBDMWJKY2lBdDIwaGpGZndHMlI2SE9nM3dxZ1JBVWhOZEM4NlV0WUdpdm9KbFdIQXVmXC9xWnJIMWpvSjhOT0ZKbm5IUmRCcVFRMUVocElwMUx2Zz09IiwibWFjIjoiNjAwNWRiYjVjMzZjOTI2OTI1NzVlOTljM2NiYmRhODZhMTEyZTA2NWQxOGU4NjVhNTIzYjhiMTFmMTA4ZjFhYSJ9; ci_session=eyJpdiI6IkxHalBHMkxvRUVEcjByU3hzUHBaeGc9PSIsInZhbHVlIjoicUtDcUVZaGtiVnRjNHJFYTZtcmpOZjFNaGZcL2V0cUpsdU50bEQ0bkM5QXhPRG1QTElUUTJNU0xTR3k1T09Vd01lbmgyRFRsUSs3cTc4MDRxM2FQTkdnPT0iLCJtYWMiOiIwYjQzNDk1NmQxYTZmMWZlOGZlMzhhZDZmYzZkY2YyYmNlZDc5YTQ4MzJmNGFkMGE5ODk1NGJjMzJiZjY3ZTEyIn0%3D; _ga=GA1.2.2004862449.1514294143; _gid=GA1.2.1908416860.1514294143; gsScrollPos-608=0; XSRF-TOKEN=eyJpdiI6IktrSExid1FTYlUxM2ZpOUREazJZR3c9PSIsInZhbHVlIjoiNWRaZFVHYm5zTGZrV2hzMWJIWnVvMFZsbVp4WDdEOHBFWU1oME1Ka0tnU0JRYktYRlNUWk9QS21IQTE0Wm1JUk5cLzFBZE4yUlZQdXY0OGFZMHVxcndnPT0iLCJtYWMiOiI5N2E1ZGJlYWMwMGM2ZGUwYjMwMGEyZDY4ZGRkZmY1NDE1ZDRjODg5M2MxNjk3NzhkYjExYzJkMjhlM2NkMDNjIn0%3D; ci_session=eyJpdiI6InpJUFkzSGhDUHpyQkd2TEpoeXNQeHc9PSIsInZhbHVlIjoiTUJTekdSV25mV0dEWFJzWEc4RUhsYlhvVHU5ZGtmUTNmMkhXdFwvMTJlS2RSVVwvUUErbDdJSHZDczIweUFIdk16MUIzYXJWMnFIUFpUTWdKeUZOWnJ6QT09IiwibWFjIjoiZGZkN2IyZjM0Y2Q3NzM3ZTFhOTZkZjE2ZjUzODc3NGE3ZTQwNWFkOWQ5MzllMzlhNzg0MjAwODU0ZWQ3OWI4OCJ9',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'referer': 'https://chartink.com/screener',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
    'x-devtools-emulate-network-conditions-client-id': '(952B7BDC5B2C593D55ED5812D0CE7F9D)',
    'x-csrf-token': 'SBIabMFZtcOrgiAEUxkL4IekEqpEJGerxAOePmBQ',
    'origin': 'https://chartink.com',
    'accept': 'application/json, text/javascript, */*; q=0.01'
  },
  SCAN_CLAUSE: {
    THREE_DAY_HIGH_CLOSE: '{cash} ( close > 1 day ago close ) and ( 1 day ago close > 2 days ago close ) and ( 2 days ago close > 3 days ago close ) and ( close > open ) and ( 1 day ago close > 1 day ago open ) and ( 2 days ago close > 2 days ago open )',
    THREE_DAY_LOW_CLOSE: '{cash} ( close < 1 day ago close ) and ( 1 day ago close < 2 days ago close ) and ( 2 days ago close < 3 days ago close ) and ( close < open ) and ( 1 day ago close < 1 day ago open ) and ( 2 days ago close < 2 days ago open )',
    BREAKOUT_15_MIN: '{cash} ( [ 0 ] 15 minute close > [ -1 ] 15 minute max ( 20 , [ 0 ] 15 minute close ) ) and ( [ 0 ] 15 minute volume > [ 0 ] 15 minute sma(volume,20) )'
  }
}


constants.SCREENER_WEIGHT = {
  CANDLESTICK: 8,
  PRICE:{
    BREAKOUT: {
      DAY: 1,
      WEEK: 2,
      MONTH: 4,
      WEEK52: 8
    },
    NEAR_52: 8
  },
  TECHNICAL: {
    RSI: {
      RSI_BULLISH: 4,
      RSI_TRENDING_UP: 2,
      RSI_OVERSOLD: 6,
      RSI_BEARISH: 4,
      RSI_TRENDING_DOWN: 2,
      RSI_OVERBOUGHT: 6
    }
  },
  CHARTINK: {
    THREE_DAY_CLOSE: 6
  }
}
constants.FEATURE_TOGGLE = {
  INTRADAY_STOCK_SELECTION: false,
  PRE_OPEN_MARKET_STOCKS_SELECTION: false
}

module.exports = constants