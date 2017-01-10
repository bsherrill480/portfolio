const cache = require('../../../server/cache'),
    uniq = {
        tracker: 0,
        string() {
            return String(this.tracker);
        }
    };

function makeTimestampKey(testId) {
    return testId + ':' + String((new Date()).getTime())
}

describe('caching', function () {
    it('should allow you to set and get', function (done) {
        const key =  makeTimestampKey('caching-set-and-get'),
            value = 'bar';
        cache.set(key, value)
            .then(function (res) {
                expect(res).toBe('OK');
                cache.get(key)
                    .then(function (res) {
                        expect(res).toBe(value);
                        done();
                    })
                    .catch(done.fail);
            })
            .catch(done.fail)
    });

    it('should allow keys to be expired', function (done) {
        const key = uniq.string(),
            value = uniq.string(),
            expireTime = 1,
            expireTimePlusOneInMs = (expireTime + 1) * 1000;
        cache.set(key, value, expireTime)
            .then(function () {
                setTimeout(function () {
                    cache.get(key)
                        .then(function (res) {
                            expect(res).toBeFalsy();
                            done()
                        })
                        .catch(done.fail);
                }, expireTimePlusOneInMs);
            })
            .catch(done.fail);
    });

    // not a great guarantee, but at least a check
    it('should have keys persist', function (done) {
        const key = uniq.string(),
            value = uniq.string(),
            checkIfExpireTimeInMs = (2) * 1000;
        cache.set(key, value)
            .then(function () {
                setTimeout(function () {
                    cache.get(key)
                        .then(function (res) {
                            expect(res).toBe(value);
                            done()
                        })
                        .catch(done.fail);
                }, checkIfExpireTimeInMs);
            })
            .catch(done.fail);
    });

    it('should have incr work', function (done) {
        const key = makeTimestampKey('inc-should-work');
        cache.increment(key)
            .then(function (res) {
                expect(res).toBe(1);
                cache.increment(key)
                    .then(function (res) {
                        expect(res).toBe(2);
                        done();
                    })
                    .catch(done.fail);
            })
            .catch(done.fail);
    });
});
