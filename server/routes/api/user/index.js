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
    passport = require('passport');




router.get('/:userId', function (req, res, next) {
    let userId = req.params.userId;
    util.queryResponse(res, userAPI.findUserById(userId));
});

router.put('/:userId', function (req, res, next) {
    let sentUser = req.body,
        userId = req.params.userId;
    util.queryResponse(res, userAPI.updateUser(userId, sentUser));
});

router.delete('/:userId', function (req, res, next) {
    let userId = req.params.userId,
        sendResponse = util.sendResponseCallback(res);
    userAPI.deleteUser(userId).then(sendResponse);
});


module.exports = router;
