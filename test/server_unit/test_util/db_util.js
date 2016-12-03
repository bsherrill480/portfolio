const mongoose = require('mongoose'),
    blueBird = require('bluebird'),
    getConfig = require('../../../server/config/get_config'),
    envs = require('../../../server/config/envs'),
    dbInitialize = require('../../../server/db/initialize');

module.exports = {
    initialize() {
        dbInitialize(envs.TEST);
    }
};
