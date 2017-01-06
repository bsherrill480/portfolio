const bcrypt = require('bcrypt'),
    saltRounds = 10,
    Promise = require('bluebird');

module.exports = {
    hashPassword(password) {
        console.log('hashPassword function');
        // return bcrypt.hashSync(password);
        return new Promise(function (resolve, reject) {
            console.log('hashPassword promise');
            bcrypt.hash(password, saltRounds, function (err, hash) {
                console.log('bcrypt hash password success: err hash: ', err, hash);
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
