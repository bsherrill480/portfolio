'use strict';

const bcrypt = require('bcryptjs'),
    saltRounds = 10,
    Promise = require('bluebird');

module.exports = {
    hashPassword(password) {
        // return bcrypt.hashSync(password);
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if(err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    },

    isValidPassword(password, passwordHash) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, passwordHash, function (err, res) {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
};
