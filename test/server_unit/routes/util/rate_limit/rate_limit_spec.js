const rateLimit = require('../../../../../server/routes/util/rate_limit'),
    cache = require('../../../../../server/cache');
function getFailRes(done) {
    return {
        json: done.fail,
        send: done.fail,
        status: done.fail       
    }
}
       

describe('rate limit', function () {
    const RESET_TIME = 2,
        MAX_REQUESTS = 1,
        LIMITER_ID = 'test-rate-limit',
        rateLimiter = rateLimit.getUserRateLimitMiddleware(LIMITER_ID, MAX_REQUESTS, RESET_TIME);

    it('should call next for a not logged in user', function () {
       const next = jasmine.createSpy();
        rateLimiter({}, {}, next);
        expect(next).toHaveBeenCalled();
    });

    it('should increment the counter and let key expire', function (done) {
        const req = {user: {_id:'rate-limit-incr'}},
            checkIfExpiredInMS = (RESET_TIME + 1) * 1000,
            res = getFailRes(done),
            next = function () {
                const key = rateLimit.getRateLimitCacheKey(LIMITER_ID, req.user._id);
                cache.get(key)
                    .then(function (res) {
                        expect(res).toBe('1');
                        setTimeout(function () {
                            cache.get(key)
                                .then(function (res) {
                                    expect(res).toBeFalsy();
                                    done();
                                })
                                .catch(done.fail);
                        }, checkIfExpiredInMS);
                    })
                    .catch(done.fail);
            };
        
        rateLimiter(req, res, next)
    });
    
    it('should throw 429 if too many requests', function (done) {
        const 
            req = {user: {_id:'rate-limit-429'}},
            res1 = getFailRes(done),
            next1 = function () {
                const key = rateLimit.getRateLimitCacheKey(LIMITER_ID, req.user._id);
                cache.get(key)
                    .then(function (res) {
                        expect(res).toBe('1');
                    })
                    .catch(done.fail);
            },
            res2 = {
                status: function (status) {
                    expect(status).toBe(429);
                    return this;
                },
                json: function (errorObj) {
                    expect(errorObj.error).toBeTruthy();
                    done();
                }
            },
            next2 = done.fail;
        
        rateLimiter(req, res1, next1);
        rateLimiter(req, res2, next2);
    });
});
