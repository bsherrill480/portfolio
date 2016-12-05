const mongoose = require('mongoose'),
  blueBird = require('bluebird'),
  getConfig = require('../config/get_config');
let initialized = false;

function initialize(env) {
  if(!initialized) {
    const config = getConfig(env);
    initialized = true;
    mongoose.connect(config.connectionString);
    mongoose.Promise = blueBird;
  }
}

module.exports = initialize;
