/**
 * Created by brian on 12/1/16.
 */
const mongoose = require('mongoose'),
  blueBird = require('bluebird'),
  getConfig = require('../../../test_tmp/config/get_config'),
  envs = require('../../../test_tmp/config/envs');

let initialized = false;

function initialize() {
  if(!initialized) {
    const config = getConfig(envs.TEST);
    initialized = true;
    mongoose.connect(config.connectionString);
    mongoose.Promise = blueBird;
  }
}

module.exports = initialize;
