const htmlUtil = require('./htmlUtil')
const _ = require('lodash')
const fs = require('fs')
const  config = require('../config')

const html = fs.readFileSync(config.root +'/stock-selector/utils/margin.html')

const getMarginStockList = function () {

 return htmlUtil.scrapeTable(html)

  .then(function (table) {

    return _.flattenDeep(table[1])
  })
   .catch(function (err) {
     console.log(err)
   })
}

module.exports = {
  getMarginStockList
}