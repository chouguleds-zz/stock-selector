'use strict'
const nodemailer = require('nodemailer')
const config = require('../config')
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({

  service: "gmail",
  auth: {
    user: "chougule.ds@gmail.com",
    pass: "kapeedchode15"
  }
})

const sendMail = function (path, subject) {

  console.log(config.root)
  let mailOptions = {
    from: '"Deepak 👻" <chougule.ds@gmail.com>', // sender address
    to: 'chougule.ds@gmail.com', // list of receivers
    subject: subject,
    attachments: [{
        filename: subject,
        path: config.root + '/stock-selector/pre_open_market_stocks/' + subject
      }]
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  });
}
module.exports = {
  sendMail
}
