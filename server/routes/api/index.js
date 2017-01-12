'use strict';

const express = require('express'),
  router = express.Router();

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/events', require('./events'));
router.use('/event_generator', require('./event_generator'));

module.exports = router;
