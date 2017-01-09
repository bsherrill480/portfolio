const express = require('express'),
  router = express.Router(),
  path = require('path'),
  api = require('./api');

// any non api request should just get back our angular app
router.use(/^\/(?!api).*/, function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, '../../build')});
});

router.use('/api', api);

module.exports = router;
