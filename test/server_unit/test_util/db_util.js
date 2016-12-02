const mongoose = require('mongoose'),
    blueBird = require('bluebird'),
    getConfig = require('../../../server/config/get_config'),
    envs = require('../../../server/config/envs')

let initialized = false;

function initialize() {
    if(!initialized) {
        const config = getConfig(envs.TEST);
        initialized = true;
        mongoose.connect(config.connectionString);
        mongoose.Promise = blueBird;
    }
}

module.exports = {
    initialize
};
