'use strict';

const crypto = require('crypto'),
    Promise = require('bluebird'),
    base64url = require('base64url'),
    cryptoRandomBytesAsync = Promise.promisify(crypto.randomBytes);

// size is not exact, but relative.
// http://stackoverflow.com/questions/8855687/secure-random-token-in-node-js/25690754#25690754
function generateRandomString(size = 20) {
    return cryptoRandomBytesAsync(size)
        .then(function (res) {
            return base64url(res);
        });
}

module.exports = {
    generateRandomUrlSafeString: generateRandomString
};
