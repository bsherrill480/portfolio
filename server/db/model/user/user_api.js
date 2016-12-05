/**
 * Created by brian on 12/2/16.
 */
const User = require('./user_model'),
    userUtil = require('./user_util');

// all functions return promises
// options are options for how to preform the query.
// e.g. updateUser('whatever', {username: 'ted'}, {lean:true}) will add the lean qualifier
// which means a plain javascript object will be returned.
module.exports = {
    createUser(newUser) {
        const user = new User(newUser);
        user.password = userUtil.hashPassword(user.password);
        return user.save();
    },

    findUserById(userId) {
        return User.findById(userId).exec();
    },

    findUserByUsername(username) {
        return User.findOne({username}).exec();
    },

    updateUser(userId, updatedUser) {
        if(updatedUser.password) {
            updatedUser.password = userUtil.hashPassword(updatedUser.password);
        }
        return User.findByIdAndUpdate(userId, {$set: updatedUser}, {new: true}).exec();
    },

    deleteUser(userId) {
        return User.findByIdAndRemove(userId).exec();
    }

    // findUser: function (user) {
    //     return User.findOne(user).exec();
    // },

    // findOrCreate(user) {
    //     return new Promise((resolve, reject) => {
    //         function resolveUserIfFoundElseCreate(searchedUserResult) {
    //             if(searchedUserResult) {
    //                 resolve(searchedUserResult);
    //             } else {
    //                 this.createUser(user)
    //                     .then(resolve)
    //                     .catch(reject)
    //             }
    //         }
    //
    //         this.findUser(user)
    //             .then(resolveUserIfFoundElseCreate)
    //             .catch(reject);
    //     });
    // },

    // findUserByFacebookId(facebookId) {
    //     return User.findOne({'facebook.id': facebookId}).exec();
    // }
};
