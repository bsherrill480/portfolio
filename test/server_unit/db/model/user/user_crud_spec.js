const testDbInit = require('../../../test_util/db_initialize'),
  models = require('../../../../../test_tmp/db/model/models'),
  envs = require('../../../../../test_tmp/config/envs'),
  asyncUtil = require('../../../test_util/async_util'),
  userAPI = models.userAPI,
  // Promise = require('bluebird'),
  testUsers = {
    bob: {
      username: 'testUserBobBar',
      password: 'test',
      firstName: 'bob',
      lastName: 'bar',
      email: 'bobbar@email.com'
    }
  };

function findBob() {
  return userAPI.findUserByUsername(testUsers.bob.username);
}

function cleanUpBobAsync(done) {
    findBob()
      .then(function (user) {
        if(user) {
          userAPI
            .deleteUser(user._id)
            .then(done)
            .catch(asyncUtil.throwErr);
        } else {
          done();
        }
      })
      .catch(asyncUtil.throwErr);
}

testDbInit();

describe('userAPI', function () {
  beforeEach(cleanUpBobAsync);

  it('should create', function (done) {
    const failIfErr = asyncUtil.getFailIfErrCallback(done);
    userAPI
      .createUser(testUsers.bob)
      .then(function (user) {
        expect(user).toBeTruthy();
        findBob()
          .then(function (user) {
            expect(user).toBeTruthy();
            expect(user.username).toBe(testUsers.bob.username);
            done();
          })
          .catch(failIfErr);
      })
      .catch(failIfErr);
  });
});

