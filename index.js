const stockController = require('./app/stock/stock.controller')
const co =require('co')

co.wrap(stockController.getIntradayStocks)()
return
