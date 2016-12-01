const envs = require('./envs'),
  devConfig = require('./dev_config'),
  testConfig = require('./test_config'),
  stagingConfig = require('./staging_config');

// pre: current node env, one of the keys in config/envs.js
// post: returns config object or throws error if env does not match expected envs.
// configObject: {
//   connectionString: String
// }
function getConfig(env) {
  if(env === envs.DEVELOPMENT) {
    return devConfig;
  } else if (env === envs.STAGING) {
    return stagingConfig;
  } else if (env === envs.TEST) {
    return testConfig;
  } else {
    throw new Error('Env not found.');
  }
}

module.exports = getConfig;