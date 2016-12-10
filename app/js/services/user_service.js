function UserService($http) {
    'ngInject';
    
    return {
        findUserById: function (userId) {
            return $http({
                method: 'GET',
                url: '/api/user/' + userId
            }).then(function (payload) {
                return payload.data;
            });
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

