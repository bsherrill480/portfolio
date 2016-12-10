function OnRun($rootScope, AppSettings, UserAuthService, $state) {
    'ngInject';

    UserAuthService.fetchIsLoggedIn();

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        const toStateName = toState.name,
            isLoggedIn = UserAuthService.isLoggedIn();
        $rootScope.pageTitle = '';


        if (toState.title) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }

        // http://stackoverflow.com/questions/27212182/angularjs-ui-router-how-to-redirect-to-login-page
        // home is always allowed
        if(toStateName === 'Home') {
            return;
        }

        if(isLoggedIn && (toStateName === 'Login' || toStateName === 'Register')) {
            event.preventDefault(); // stop current execution
            $state.go('Home');
        } else if (!isLoggedIn && (toStateName !== 'Login' || toStateName !== 'Register')) {
            $state.go('Login');
        }

        $rootScope.pageTitle += AppSettings.appTitle;


    });

}

export default OnRun;
