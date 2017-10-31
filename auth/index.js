'use strict';

var express = require('express');
var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;