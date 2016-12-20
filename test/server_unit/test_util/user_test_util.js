const models = require('../../../server/db/model/models'),
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

//login as user through passed agent and then return db object of testUser
function loginAsTestUser(testUser, agent) {
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

function generateTestUser() {
    return testUsersGen.generateTestUser()
}

function generateAndSaveTestUser() {
    return userAPI.createUser(generateTestUser());
}

function createAndLoginAsTestUser(agent) {
    return new Promise(function (resolve, reject) {
        const testUser = generateTestUser();
        userAPI.createUser(testUser)
            .then(function () {
                loginAsTestUser(testUser, agent)
                    .then(resolve)
                    .catch(reject)
            })
            .catch(reject);
    });
}

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
        
        getTestUser: function (testUser) {
            return userAPI.findUserByEmail(testUser.email);
        }
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
    
    generateTestUser: generateTestUser,

    generateAndSaveTestUser: generateAndSaveTestUser,
    
    loginAsTestUser: loginAsTestUser,
    
    createAndLoginAsTestUser: createAndLoginAsTestUser
    

};

