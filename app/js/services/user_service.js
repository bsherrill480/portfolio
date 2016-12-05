function UserService($http) {
    'ngInject';
    
    return {
        createUser: function (user) {
            return $http({
                method: 'POST',
                url: '/api/auth/register',
                data: user
            }).then(function (payload) {
                return payload.data;
            });
        },


        findUserById: function (userId) {
            return $http({
                method: 'GET',
                url: '/api/user/' + userId
            }).then(function (payload) {
                return payload.data;
            });
        },

        findUserByUsername: function (username) {
            return $http({
                method: 'GET',
                url: '/api/user' ,
                data: {
                    username: username
                }
            });
        },

        loginUserByCredentials: function (username, password) {
            return $http({
                method: 'POST',
                url: '/api/auth/login' ,
                data: {
                    username: username,
                    password: password
                }
            }).then(function (payload) {
                return payload.data;
            });
        },
            
        logoutUser: function () {
            return $http({
                method: 'POST',
                url: '/api/auth/logout'
            })
        },

        updateUser: function (userId, user) {
            return $http({
                method: 'PUT',
                url: '/api/user/' + userId,
                data: user
            });
        },
            
        //returns userId if user is logged in, else returns an emtpy string
        getUserId: function () {
            return $http({
                method: 'GET',
                url: '/api/auth/userId'
            }).then(function(payload) {
                return payload.data; // payload.data = userId
            });
        }
    };
}

export default {
    name: 'UserService',
    fn: UserService
};

