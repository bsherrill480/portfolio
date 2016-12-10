// require('bootstrap'); // requires bootstrap javascript file
// require('moment');

function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $compileProvider) {
    'ngInject';
    const env = process.env.NODE_ENV;
    if (env === 'production' || env === 'staging') {
        $compileProvider.debugInfoEnabled(false);
    }

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('Home', {
            url: '/',
            template: '<home></home>',
            title: 'Home'
        })
        .state('Login', {
            url: '/login',
            template: '<login></login>',
            // resolve: {
            //     auth: function(UserAuthService, $q) {
            //         var deferred = $q.defer();
            //         if (!UserAuthService.isLoggedIn()) {
            //             return deferred.resolve({});
            //         } else {
            //             return deferred.reject({redirectTo: 'Home'});
            //         }
            //     }
            // }

            // return UserService.load().then(function(user){
            //     if (permissionService.can(user, {goTo: state})) {
            //         return deferred.resolve({});
            //     } else {
            //         return deferred.reject({redirectTo: 'some_other_state'});
            //     }
            // });
            // resolve: {
            // data: function ($q, UserAuthService, $state) {
            //     const deferred = $q.defer();
            //     console.log('resolve login');
            //     if(UserAuthService.isLoggedIn()) {
            //         deferred.reject();
            //     } else {
            //         console.log('Not Logged in');
            //         deferred.resolve();
            //     }
            //     return deferred.promise.catch(function () {
            //
            //     } $state.go('Home'));
            // }
            // }
        })
        .state('Register', {
            url: '/register',
            template: '<register></register>'
        });
    // .state('Profile', {
    //   url: '/profile/:userId',
    //   template: '<profile></profile>'
// });

    $urlRouterProvider.otherwise('/');

}

export default OnConfig;
