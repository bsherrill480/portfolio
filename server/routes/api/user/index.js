/**
 *
 * Created by brian on 10/30/16.
 */
const express = require('express'),
    _ = require('lodash'),
    util = require('../api_util'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    userAPI = models.userAPI,
    passport = require('passport'),
    internalUserAttributes = ['password', 'facebook'];

// takes in an object, and returns a new object with all the attributes the public can see
// e.g. doesn't return password.
function removeInternalUserAttributes(user) {
    _.each(internalUserAttributes, function (attribute) {
        delete user[attribute];
    });   
}

function formatUserResponse(user) {
    _.each(internalUserAttributes, function (attribute) {
        user[attribute] = undefined;
    });    
    return user;
}

router.get('/:userId', function (req, res, next) {
    let userId = req.params.userId;
    util.queryResponse(res, userAPI.findUserById(userId, {lean: true}).then(formatUserResponse));
});

router.put('/:userId', function (req, res, next) {
    let receivedUser = req.body,
        userId = req.params.userId;
    removeInternalUserAttributes(receivedUser);
    util.queryResponse(res, userAPI.updateUser(userId, receivedUser).then(formatUserResponse));
});

module.exports = router;
