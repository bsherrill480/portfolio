/**
 * Created by brian on 12/2/16.
 */

const User = require('../../../../../server/db/model/user/user_model'),
    testUsers = {
        _testUser: 0,

        // We have to generate users because tests are async, however username and email are unique
        // in the db.
        generateTestUser() {
            const testUserStr = String(this._testUser);
            this._testUser++;
            return {
                username: testUserStr,
                password: testUserStr,
                firstName: testUserStr,
                lastName: testUserStr,
                email: testUserStr + '@' + testUserStr + '.com'
            }
        }
    };

module.exports = {
    cleanUpAsyncUsers() {
        return User.remove({}).exec();
    },
    
    generateTestUser() {
        return testUsers.generateTestUser()
    }
};

