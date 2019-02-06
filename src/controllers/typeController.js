const router = require('express').Router();
const typeService = require('../services/typeService');
const automaticControllerBuilder = require('./automaticControllerBuilder');

automaticControllerBuilder(router, typeService);

module.exports = router;