/**
 * Created by brian on 12/2/16.
 */

const User = require('../../../server/db/model/user/user_model'),
    models = require('../../../server/db/model/models'),
    userAPI = models.userAPI,
    _ = require('lodash'),
    Promise = require('bluebird'),
    testUsersGen = {
        _testUser: 0,

        // We have to generate users because tests are async, however username and email are unique
        // in the db.
        generateTestUser() {
            const testUserStr = String(this._testUser);
            this._testUser++;
            return {
                email: testUserStr + '@' + testUserStr + '.com',
                password: testUserStr,
                facebook: {
                    id: testUserStr,
                    token: testUserStr
                },
                google: {
                    id: testUserStr,
                    accessToken: testUserStr
                }
            }
        }
    };

module.exports = {
    testUsers: {
        // keep usernames unique
        u1: {
            email: 'a' + '@' + 'a' + '.com',
            password: 'a',
            facebook: {
                id: 'a',
                token: 'a'
            },
            google: {
                id: 'a',
                accessToken: 'a'
            }

        },
        
        getTestUserId: function (testUser) {
            return userAPI.findUserByEmail(testUser.email);
        }
    },
    
    cleanUpAsyncUsers() {
        return User.remove({}).exec();
    },
    
    generateTestUser() {
        return testUsersGen.generateTestUser()
    },
    
    generateAndSaveTestUser() {
        return userAPI.createUser(this.generateTestUser());
    },
    
    // target is usually a generated user
    expectUser(user, target, options) {
        const ignoreFacebook = _.get(options, 'ignoreFacebook'),
            ignoreGoogle = _.get(options, 'ignoreGoogle');
        expect(user).toBeTruthy();
        expect(user.email).toBe(target.email);
        expect(user.isValidPassword(target.password)).toBeTruthy();
        expect(user.isValidPassword('foobar')).toBeFalsy();
        expect(user.updatedAt).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user._id).toBeDefined();
        if(!ignoreFacebook) {
            expect(user.facebook.id).toBe(target.facebook.id);
            expect(user.facebook.token).toBe(target.facebook.token);
        }
        if(!ignoreGoogle) {
            expect(user.google.id).toBe(target.google.id);
            expect(user.google.accessToken).toBe(target.google.accessToken);
        }
    },
    
    //login as user through passed agent and then return db object of testUser
    loginAsTestUser(testUser, agent) {
        return new Promise(function (resolve, reject) {
            agent
                .post('/api/auth/login')
                .set('Accept', 'application/json')
                .send({
                    username: testUser.email,
                    password: testUser.password
                })
                .end(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        userAPI
                            .findUserByEmail(testUser.email)
                            .then(function (user) {
                                if(user) {
                                    resolve(user);
                                } else {
                                    reject('findUserByEmail returned null!');
                                }
                            })
                            .then(resolve)
                            .catch(reject);
                    }
                });
        });
    }
};

