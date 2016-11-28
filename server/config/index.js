const envs = {
  DEVELOPMENT: 'development',
  STAGING: 'staging'
};

function getConfig(env) {
  if(env === envs.DEVELOPMENT) {
    return require('./dev');
  }
  return require('./staging');
}

module.exports = getConfig;
