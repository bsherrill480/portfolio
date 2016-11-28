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
      controller: 'ExampleCtrl as home',
      templateUrl: 'home.html',
      title: 'Home'
    })
    .state('Login', {
      url: '/login',
      template: '<login></login>'
    });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
