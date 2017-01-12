'use strict';

const cache = require('../../../cache'),
    apiUtil = require('../../api/api_util'),
    Promise = require('bluebird'),
    rateLimitIdent = 'rate-limit';

function getRateLimitCacheKey(limiterId, userIdString) {
    return `${rateLimitIdent}:${limiterId}:${userIdString}`;
}

function userRateLimitMiddleware(limiterId, numRequests, resetTime) {
    if(numRequests < 1) {
        throw 'numRequests must be greater than or equal to 1';
    }

    return function (req, res, next) {
        if(req.user) {
            const userIdString = req.user._id.toString(),
                rateLimitKey = getRateLimitCacheKey(limiterId, userIdString);
                cache.increment(rateLimitKey)
                    .then(function (count) {
                        let prePromise;

                        if(count == 1) {
                            prePromise = cache.expire(rateLimitKey, resetTime);
                        } else {
                            prePromise = Promise.resolve();
                        }

                        prePromise
                            .then(function () {
                                if(count <= numRequests) {
                                    next(); // they're okay
                                } else {
                                    apiUtil.errorResponse(res, 429,
                                        'Too many requests from you, please wait and try again.');
                                }
                                return null;
                            })
                            .catch(function (err) {
                                console.log(`expire error for ${rateLimitKey}`, err);
                                cache.set(rateLimitKey, 0, resetTime);
                                next();
                            });
                        
                        return null;
                    })
                    .catch(function (err) {
                        console.log(`caching error for ${rateLimitKey}`, err);
                        apiUtil.errorResponse(res, 500, err);
                    });
        } else {
            console.log('Can\`t rate limit no user');
            next();
        }
    }
}

module.exports = {
    rateLimitIdent: rateLimitIdent,
    getRateLimitCacheKey: getRateLimitCacheKey,
    getUserRateLimitMiddleware: userRateLimitMiddleware
};
