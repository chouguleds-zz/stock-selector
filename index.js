const stockController = require('./app/stock/stock.controller')
const constants = require('./utils/constants')
const co = require('co')
const fs = require('fs')
const bluemixUtil = require('./utils/blumixUtil')

const preOpenDirectory = './' + constants.PRE_OPEN_MARKET_STOCKS_DIRECTORY_NAME
const intradayStockDirectory = './' + constants.STOCK_DIRECTORY_NAME

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

bluemixUtil.getSentiment('Bad news for Innate Pharma as BMS-backed drug stumbles Lirilumab combination fails to show additional benefit in SCCHN patients BMSFrench biotech Innate Pharma says it can’t see a development path forward for its lead cancer drug lirilumab after another clinical trial miss. The Bristol-Myers Squibb-partnered checkpoint inhibitor, licensed in a $465m deal in 2011, said that the combination of lirilumab and BMS’ PD-1 inhibitor Opdivo (nivolumab) failed to show any additional benefit compared to Opdivo alone in patients with squamous cell carcinoma of the head and neck (SCCHN). It’s not the first disappointment in the lirilumab programme. Earlier this year, the anti-killer cell immunoglobulin-like receptor (KIR) antibody flunked the EffiKIR trial in acute myeloid leukaemia (AML), and Innate indicated at the time that it was banking on positive results from the head and neck cancer study. Undeterred by the setback, Innate and BMS also kicked off a series of other trials of the combination of Opdivo and lirilumab in advanced solid tumours, in some cases adding in BMS’s CTLA4 inhibitor Yervoy (ipilimumab) in a triple regimen. In a statement, Innate said the pairing in SCCHN “did not provide clear evidence of benefit to patients or an obvious development path”, adding that “discussions are ongoing regarding next steps for the programme”. “Clearly this is disappointing, but we remain convinced, based on broad preclinical evidence, that natural killer cells play an important role in cancer immunosurveillance,” said Innate’s chairman and CEO Mondher Mahjoubi, who joined the company from AstraZeneca earlier this year. “Together with [BMS] we will further examine these data to better understand the results and explore whether other combinations should be investigated.” The biotech also said that a new look at data from the EffiKIR study has suggested that different dosing regimens with lirilumab might still have potential. Specifically, it said alternate dosing regimens where KIR receptors are not permanently occupied and are allowed to interact with ligands during cell maturation could be worth exploring as permanently blocking may impair the activity of NK cells. Innate is also developing another checkpoint inhibitor - a CD94/NKG2A targeting antibody called monalizumab - as a monotherapy and in combination with AZ’s recently-approved PD-L1 inhibitor Imfinzi (durvalumab). It completed a phase I dose escalation study last year and is expecting monotherapy data in 2018.')
  .then(function (sentiment) {
    console.log(sentiment)
  })

return
