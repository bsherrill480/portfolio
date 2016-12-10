const Promise = require('bluebird'),
    _ = require('lodash');

function UserAuthService() {
    const userSingleton = {
        userId: ''
    },
        listeners = [userSingleton],
        api = {
            isLoggedIn() {
                return userSingleton.userId;
            },

            setUserId(newId) {
                _.each(listeners, (listener) => listener.userId = newId);
            },

            login(username, password) {
                console.log('login, username password', username, password);
                return new Promise(function (resolve, reject) {
                    setUserId('1');
                    resolve(userSingleton);
                    reject;
                });
            },

            logout() {
                console.log('logout');
                return new Promise(function (resolve, reject) {
                    setUserId('0');
                    resolve(userSingleton);
                    reject;
                });
            },

            // get an object that attributes change when userSingleton's attributes change, but is not
            // user singleton.
            getListener() {
                const listener = _.assign({}, userSingleton);
                listeners.push(listener);
                return listener;

            }
        };
    window.testUserAuthService = api;
    return api;
}

export default {
    name: 'UserAuthService',
    fn: UserAuthService
};
