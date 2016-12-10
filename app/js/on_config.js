require('bootstrap'); // requires bootstrap javascript file

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
    // .state('Login', {
    //   url: '/login',
    //   template: '<login></login>'
    // })
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
