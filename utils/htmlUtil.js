const csv = require('fast-csv')
const xray = require('x-ray')()
const Promise = require('bluebird')
const tabletojson = require('tabletojson')

const scrapeTable = function (html) {

  return new Promise(function(resolve, reject) {

    xray(html, ['table@html'])(function (conversionError, tableHtmlList) {
      if (conversionError) {
        return reject(conversionError)
      }
      resolve(tableHtmlList.map(function(table) {
        return tabletojson.convert('<table>' + table + '</table>')[0]
      }))
    })
  })
}

module.exports = {
  scrapeTable
}