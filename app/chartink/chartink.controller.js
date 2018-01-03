const chartinkService = require('./chartink.service')

const getThreeDaysCloseStocks = async function (type) {

  try {
    const stocks = await chartinkService.getThreeDaysCloseStocks(type)
    return stocks.data
  } catch (err) {
    console.log(err)
  }
}

const get15MinBreakoutStocks = async function () {

  try {
    const stocks = await chartinkService.get15MinBreakoutStocks()
    return stocks.data

  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getThreeDaysCloseStocks,
  get15MinBreakoutStocks
}