const redis = require('redis'),
    config = require('../config/get_config')(),
    client = redis.createClient(config.redisOptions),
    bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function get(key) {
    return client.getAsync(key);
}

function expire(key, time) {
        return client.expireAsync(key, time);
}

function set(key, val, expireTime) {
    return client.setAsync(key, val)
        .then(function (res) {
            if(expireTime) {
                expire(key, expireTime);
            }
            return res;
        });
}


module.exports = {
    set: set,
    get: get,
    expire: expire
};
