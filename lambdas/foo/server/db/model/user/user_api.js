/**
 * Created by brian on 12/2/16.
 */
const User = require('./user_model'),
    userUtil = require('./user_util'),
    Promise = require('bluebird');

// all functions return promises
module.exports = {
    createUser(newUser) {
        const user = new User(newUser),
            plaintextPassword = newUser.password,
            passwordHashPromise = userUtil.hashPassword(plaintextPassword);
        console.log('create user function');
        return new Promise(function (resolve, reject) {
            passwordHashPromise
                .then(function (hash) {
                    console.log('hashed password', hash);
                    user.password = hash;
                    user.save()
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    findUserById(userId) {
        return User.findById(userId).exec();
    },

    findUserByEmail(email) {
        return User.findOne({email}).exec();
    },

    updateUser(userId, updatedUser) {
        const plaintextPassword = updatedUser.password;

        return new Promise(function (resolve, reject) {
            function updateUserAndResolve() {
                User.findByIdAndUpdate(userId, {$set: updatedUser}, {new: true}).exec()
                    .then(resolve)
                    .catch(reject);
            }

            if(plaintextPassword) {
                userUtil.hashPassword(plaintextPassword)
                    .then(function (hash) {
                        user.password = hash;
                        updateUserAndResolve();
                    })
                    .catch(reject);
            } else {
                updateUserAndResolve();
            }
        });
    },

    deleteUser(userId) {
        return User.findByIdAndRemove(userId).exec();
    },

    findUser: function (user) {
        return User.findOne(user).exec();
    },

    findOrCreate(findUser, createUser) {
        const self = this;

        return new Promise((resolve, reject) => {
            function resolveUserIfFoundElseCreate(searchedUserResult) {
                if(searchedUserResult) {
                    console.log('found user', searchedUserResult);
                    resolve(searchedUserResult);
                } else {
                    console.log('going to create user', createUser);
                    self.createUser(createUser)
                        .then(resolve)
                        .catch(reject)
                }
            }

            this.findUser(findUser)
                .then(resolveUserIfFoundElseCreate)
                .catch(reject);
        });
    },

    findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId}).exec();
    }
};
