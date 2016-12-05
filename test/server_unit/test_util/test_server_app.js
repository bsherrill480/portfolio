/**
 * 
 * Created by brian on 12/4/16.
 */
const envs = require('../../../server/config/envs'),
    app = require('../../../server/server_app')(envs.TEST);

module.exports = app;
    
