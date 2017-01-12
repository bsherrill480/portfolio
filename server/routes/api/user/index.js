'use strict';

const express = require('express'),
    util = require('../api_util'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    userAPI = models.userAPI;



router.get('/:userId', function (req, res, next) {
    let userId = req.params.userId;
    util.queryResponse(res, userAPI.findUserById(userId).then(util.formatUserResponse));
});

router.put('/:userId', function (req, res, next) {
    let receivedUser = req.body,
        userId = req.params.userId;
    util.removeInternalUserAttributes(receivedUser);
    util.queryResponse(res, userAPI.updateUser(userId, receivedUser).then(util.formatUserResponse));
});

module.exports = router;
