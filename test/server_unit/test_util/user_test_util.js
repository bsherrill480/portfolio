/**
 * Created by brian on 12/2/16.
 */

const User = require('../../../server/db/model/user/user_model'),
    models = require('../../../server/db/model/models'),
    userAPI = models.userAPI,
    _ = require('lodash'),
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
                email: testUserStr + '@' + testUserStr + '.com',
                facebook: {
                    id: testUserStr,
                    token: testUserStr
                }
            }
        }
    };

module.exports = {
    cleanUpAsyncUsers() {
        return User.remove({}).exec();
    },
    
    generateTestUser() {
        return testUsers.generateTestUser()
    },
    
    generateAndSaveTestUser() {
        return userAPI.createUser(this.generateTestUser());
    },
    
    // target is usually a generated user
    expectUser(user, target, options) {
        const ignoreFacebook = _.get(options, 'ignoreFacebook');
        expect(user).toBeTruthy();
        expect(user.username).toBe(target.username);
        expect(user.isValidPassword(target.password)).toBeTruthy();
        expect(user.isValidPassword('foobar')).toBeFalsy();
        expect(user.firstName).toBe(target.firstName);
        expect(user.lastName).toBe(target.lastName);
        expect(user.email).toBe(target.email);
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user._id).toBeDefined();
        if(!ignoreFacebook) {
            expect(user.facebook.id).toBe(target.facebook.id);
            expect(user.facebook.token).toBe(target.facebook.token);
        }
    }
};

