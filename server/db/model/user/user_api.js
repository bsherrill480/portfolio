/**
 * Created by brian on 12/2/16.
 */
const User = require('./user_model'),
    userUtil = require('./user_util');

// all functions return promises
module.exports = {
    createUser(newUser) {
        const user = new User(newUser);
        user.password = userUtil.hashPassword(user.password);
        return user.save();
    },

    findUserById(userId) {
        return User.findById(userId).exec();
    },

    findUserByEmail(email) {
        return User.findOne({email}).exec();
    },

    updateUser(userId, updatedUser) {
        if(updatedUser.password) {
            updatedUser.password = userUtil.hashPassword(updatedUser.password);
        }
        return User.findByIdAndUpdate(userId, {$set: updatedUser}, {new: true}).exec();
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
