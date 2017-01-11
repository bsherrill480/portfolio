require('bootstrap'); // requires bootstrap javascript file
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
            url: '/Login',
            template: '<login></login>',
            title: 'Login'
        })
        .state('Register', {
            url: '/Register',
            template: '<register></register>',
            title: 'Register'
        })
        .state('EventsSuggestions', {
            url: '/Suggested_Events',
            template: '<events-suggestions></events-suggestions>',
            title: 'Suggested Events'
        })
        .state('MyEvents', {
            url: '/My_Events',
            template: '<my-events></my-events>',
            title: 'My Events'
        })
        .state('Profile', {
            url: '/Profile',
            template: '<profile></profile>',
            title: 'Profile'
        })
        .state('ViewEvent', {
            url: '/My_Events/View_Event/:eventGeneratorId',
            template: '<view-event></view-event>',
            title: 'View Event'
        })
        .state('VerifyEmail', {
            url: '/Verify/Email/:code',
            template: '<verify-email></verify-email>',
            title: 'Verify Email'
        })
    ;

    $urlRouterProvider.otherwise('/');

}

export default OnConfig;
