/**
 * Created by brian on 12/1/16.
 */

const testsFailed = 'Tests failed';

const asyncUtil = {
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
