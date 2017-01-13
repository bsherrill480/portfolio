'use strict';

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
    const keyStr = key.toString(),
        valStr = val.toString();
    if(!keyStr || !valStr) {
        console.log('cache set key/val error', key, val);
        throw 'cache set error. key.toString or val.toString returned empty'
    }
    return client.setAsync(keyStr, valStr)
        .then(function (res) {
            if(expireTime) {
                expire(keyStr, expireTime);
            }
            return res;
        });
}

function increment(key) {
    return client.incrAsync(key);
}



module.exports = {
    set: set,

    get: get,

    expire: expire,

    increment: increment,

    client: client
};
