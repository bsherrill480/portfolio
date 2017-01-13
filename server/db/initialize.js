'use strict';

const mongoose = require('mongoose'),
    BlueBird = require('bluebird'),
    Promise = BlueBird,
    getConfig = require('../config/get_config');

mongoose.connectAsync = Promise.promisify(mongoose.connect);

let initialized = false;

function initialize(env, options) {
    options = options || {};
    if(!initialized) {
        const config = getConfig(env);
        mongoose.Promise = BlueBird;
        initialized = true;
        return mongoose.connectAsync(config.connectionString, options);
    }
    return Promise.resolve();
}

module.exports = initialize;
