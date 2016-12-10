function UserAuthService($http) {
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

    return {
        isLoggedIn() {
            return userSingleton.userId;
        },

        fetchIsLoggedIn() {
            $http({
                method: 'GET',
                url: '/api/auth/userId'
            }).then(getUserIdAndReturnData);
        },

        register: function (user) {
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
        },


        login: function (user) {
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
        },

        logout: function () {
            return $http({
                method: 'POST',
                url: '/api/auth/logout'
            })
        }
    };
}

export default {
    name: 'UserAuthService',
    fn: UserAuthService
};
