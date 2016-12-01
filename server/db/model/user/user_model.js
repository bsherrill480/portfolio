const userSchema = require('./user_schema'),
    mongoose = require('mongoose'),
    User = mongoose.model('User', userSchema),
    Promise = require('bluebird');

//all functions return promises
module.exports = {
    createUser(newUser) {
        const user = new User(newUser);
        user.password = user.hashPassword(user.password);
        return user.save();
    },

    findUserById(userId) {
        return User.findById(userId).exec();
    },

    findUserByUsername(username) {
        return User.findOne({username}).exec();
    },

    updateUser(userId, user) {
        return User.findByIdAndUpdate(userId, user).exec();
    },

    deleteUser(userId) {
        return User.findByIdAndRemove(userId).exec();
    },

    findUser: function (user) {
        return User.findOne(user).exec();
    },

    findOrCreate(user) {
        return new Promise((resolve, reject) => {
            function resolveUserIfFoundElseCreate(searchedUserResult) {
                if(searchedUserResult) {
                    resolve(searchedUserResult);
                } else {
                    this.createUser(user)
                        .then(resolve)
                        .catch(reject)
                }
            }

            this.findUser(user)
                .then(resolveUserIfFoundElseCreate)
                .catch(reject);
        });
    },

    findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId}).exec();
    }
};
