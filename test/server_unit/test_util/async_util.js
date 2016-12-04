/**
 * Created by brian on 12/1/16.
 */

const testsFailed = 'Tests failed';

const asyncUtil = {
    
    // Ran into a situation where tests would fail but done would still get called.
    // When this happened we ended up calling done twice, so this function won't call done
    // if the tests fail
    getFailIfErrCallback(done) {
        return function (err) {
            // If error is "Tests failed", we've already called done and noticed we failed.
            // else we need to fail.
            if(err && err.message !== testsFailed) { 
                done.fail(err);
                return null;
            }
            return err;
        }
    },
  
    throwErr(err) {
        throw err;
    }
};

module.exports = asyncUtil;
