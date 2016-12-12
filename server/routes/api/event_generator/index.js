const express = require('express'),
    util = require('../api_util'),
    router = express.Router(),
    models = require('../../../db/model/models'),
    eventGeneratorAPI = models.eventGeneratorAPI;

function userIsLoggedIn(req, res, next) {
    const user = req.user;
    if(user) {
        next();
    } else {
        util.errorResponse(res, 401, 'Not Logged In');
    }
}

router.get('/', userIsLoggedIn, function (req, res, next) {
    const userId = req.user._id;
    util.queryResponse(
        res,
        eventGeneratorAPI.findAllEventGeneratorsForUser(userId)
    );
});

router.post('/', userIsLoggedIn, function (req, res, next) {
    const receivedEventGenerator = req.body,
        userId = req.user._id;
    util.queryResponse(
        res,
        eventGeneratorAPI.createEventGenerator(userId, receivedEventGenerator)
    );
});


router.put('/:eventGeneratorId', userIsLoggedIn, function (req, res, next) {
    const receivedEventGenerator = req.body,
        eventGeneratorId = req.params.eventGeneratorId,
        updateCallback = function() {
            console.log('update callback', eventGeneratorId, receivedEventGenerator);
            util.queryResponse(
                res,
                eventGeneratorAPI.updateEventGenerator(eventGeneratorId, receivedEventGenerator)
            );
        };
    util.userIsOwnerThenCallback(
        res,
        req.user._id,
        eventGeneratorAPI.findEventGeneratorById(eventGeneratorId),
        updateCallback
    );
});

router.delete('/:eventGeneratorId', userIsLoggedIn, function (req, res, next) {
    const eventGeneratorId = req.params.eventGeneratorId,
        deleteCallback = function () {
            eventGeneratorAPI
                .deleteEventGenerator(eventGeneratorId)
                .then(util.sendResponseCallback(res))
                .catch(util.queryFailedCallback(res))
        };

    util.userIsOwnerThenCallback(
        res,
        req.user._id,
        eventGeneratorAPI.findEventGeneratorById(eventGeneratorId),
        deleteCallback
    );
});



module.exports = router;
