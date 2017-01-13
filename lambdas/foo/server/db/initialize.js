'use strict';

const mongoose = require('mongoose'),
    BlueBird = require('bluebird'),
    Promise = BlueBird,
    getConfig = require('../config/get_config');

mongoose.connectAsync = Promise.promisify(mongoose.connect);

let initialized = false,
    mongoosePromise;

function initialize(env, options) {
    options = options || {};
    if(!initialized) {
        console.log('dbInit');
        const config = getConfig(env);
        initialized = true;
        mongoosePromise = mongoose.connectAsync(config.connectionString, options);
        mongoose.Promise = BlueBird;
    }
    return mongoosePromise;
}

module.exports = initialize;
