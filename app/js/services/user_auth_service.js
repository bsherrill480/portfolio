function UserAuthService($http, $q) {
    'ngInject';
    const userSingleton = {
        userId: ''
    };
    window.userSingleton = userSingleton;

    function getUserIdAndReturnData (payload) {
        const payloadData = payload.data;
        userSingleton.userId = payloadData._id;
        return payloadData;
    }

    function fetchIsLoggedIn() {
        return $http({
            method: 'GET',
            url: '/api/auth/userId'
        }).then(getUserIdAndReturnData);
    }
    function isAlreadyLoggedIn() {
        return userSingleton.userId;
    }

    // resolves with userId if user id logged in, else resolved with empty string
    function getUserId() {
        return new $q(function (resolve, reject) {
            if(isAlreadyLoggedIn()) {
                resolve(userSingleton.userId);
            } else {
                fetchIsLoggedIn()
                    .then(function (payload) {
                        resolve(payload._id);
                    })
                    .catch(reject)
            }

        });
    }
    function register (user) {
        const email = user.email,
            password = user.password;
        return $http({
            method: 'POST',
            url: '/api/auth/register',
            data: {
                email: email,
                username: email,
                password: password
            }
        }).then(getUserIdAndReturnData);
    }

    function login (user) {
        const email = user.email,
            password = user.password;

        return $http({
            method: 'POST',
            url: '/api/auth/login' ,
            data: {
                email: email,
                username: email,
                password: password
            }
        }).then(getUserIdAndReturnData);
    }

    function logout () {
        return $http({
            method: 'POST',
            url: '/api/auth/logout'
        }).then(function (payload) {
            userSingleton.userId = '';
            return payload;
        })
    }

    // should be the same as server/user_consts.js, should add test to check this.
    function getEmailStates () {
        const UNVERIFIED = 'unverified',
            VERIFIED = 'verified',
            BOUNCED = 'bounced';
        return {
            UNVERIFIED: UNVERIFIED,
            VERIFIED: VERIFIED,
            BOUNCED: BOUNCED
        };
    }

    function sendVerificationEmail() {
        return $http({
            method: 'POST',
            url: '/api/auth/sendVerificationEmail'
        });
    }

    function confirmVerificationEmail(code) {
        return $http({
            method: 'POST',
            url: '/api/auth/confirmVerificationEmail',
            data: {
                code: code
            }
        }).
        then(function (res) {
            return res.data;
        });
    }

    return {
        isAlreadyLoggedIn: isAlreadyLoggedIn,

        fetchIsLoggedIn: fetchIsLoggedIn,

        getUserId:getUserId,

        register: register,

        login: login,

        logout: logout,

        getEmailStates: getEmailStates,

        sendVerificationEmail: sendVerificationEmail,

        confirmVerificationEmail: confirmVerificationEmail
    };
}

export default {
    name: 'UserAuthService',
    fn: UserAuthService
};
