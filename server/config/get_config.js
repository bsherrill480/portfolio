const envs = require('./envs'),
    devConfig = require('./dev_config'),
    testConfig = require('./test_config'),
    prodConfig = require('./prod_config'),
    stagingConfig = require('./staging_config');

// pre: current node env, one of the keys in config/envs.js
// post: returns config object or throws error if env does not match expected envs.
// configObject: {
//   connectionString: String
// }
function getConfig(env) {
    env = env || process.env.NODE_ENV;
    if(env === envs.DEVELOPMENT) {
        return devConfig;
    } else if (env === envs.STAGING) {
        return stagingConfig;
    } else if (env === envs.TEST) {
        return testConfig;
    } else if (env === envs.PROD) {
        return stagingConfig;
    } else {
        throw new Error('Env not found for ' + env);
    }
}

module.exports = getConfig;
