const envs = require('../../../server/config/envs'),
    dbInitialize = require('../../../server/db/initialize');

module.exports = {
    initialize() {
        dbInitialize(envs.TEST);
    }
};
