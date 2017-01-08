const cache = require('../../../server/cache'),
    uniq = {
        tracker: 0,
        string() {
            return String(this.tracker);
        }
    };

console.log('cache', cache);
describe('caching', function () {
    it('should allow you to set and get', function (done) {
        const key =  'test: ' + String((new Date()).getTime()),
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
    it('should have keys last', function (done) {
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
});
