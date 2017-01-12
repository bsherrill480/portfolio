'use strict';

const _ = require('lodash'),
    internalUserAttributes = ['password', 'facebook', 'google'];

function errorResponse(res, status, message) {
    res.status(status).json({
        error: message
    })
}

module.exports = {
    userIsLoggedIn(req, res, next) {
        const user = req.user;
        if(user) {
            next();
        } else {
            errorResponse(res, 401, 'Not Logged In');
        }
    },

    // calls callback if user is owner
    userIsOwnerThenCallback(res, userId, itemPromise, doUpdateCallback) {
        const self = this;
        itemPromise
            .then(function (result) {
                if(result && userId && result._user.toString() === userId.toString()) {
                    doUpdateCallback(res);
                } else {
                    errorResponse(res, 403, 'Forbidden');
                }
                return result;
            })
            .catch(self.queryFailedCallback(res));
    },
    
        // calls callback if user is owner
    userIsOwnerThenRespond(res, userId, itemPromise) {
        const self = this;
        itemPromise
            .then(function (result) {
                if(result && userId && result._user.toString() === userId.toString()) {
                    res.json(result);
                } else {
                    errorResponse(res, 403, 'Forbidden');
                }
                return result;
            })
            .catch(self.queryFailedCallback(res));
    },

    queryResponse(res, queryPromise) {
        let queryFailedResponse = this.queryFailedCallback(res);
        queryPromise
            .then(function(result) {
                res.json(result)
            })
            .catch(queryFailedResponse);
    },

    queryFailedCallback(res) {
        return (err) => {
            console.log('dberr', err);
            errorResponse(res, 500, 'Database error');
            // res.status(500).json({
            //     error: 'Database error'
            // });
            return err;
        }
    },

    sendResponseCallback: function (res, resArg) {
        return () => res.send(resArg);
    },

    // takes in an object, and returns a new object with all the attributes the public can see
    // e.g. doesn't return password.
    removeInternalUserAttributes(user) {
        _.each(internalUserAttributes, function (attribute) {
            delete user[attribute];
        });
    },

    formatUserResponse(user) {
        _.each(internalUserAttributes, function (attribute) {
            user[attribute] = undefined;
        });
        return user;
    },

    errorResponse,

    badParamsJsonResponse(res) {
        errorResponse(res, 400, 'Bad Params')
    }
};
