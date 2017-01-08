const express = require('express'),
    util = require('../api_util'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    userAPI = models.userAPI,
    cache = require('../../../cache');



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

router.get('/get/:key', function (req, res, next) {
    let key = req.params.key;
    cache.get(key)
        .then(function (val) {
            res.send(String(val));
        })
        .catch(function (err) {
            res.send(err);
        });
});

router.get('/set/:key/:val', function (req, res, next) {
    let key = req.params.key,
        val = req.params.val;
    cache.set(key, val);
    res.send('Set');
});
module.exports = router;
