function hasPermission(isLoggedIn, toStateName, event, $state) {
    // if toStateName is Home, we already let them go there
    if(isLoggedIn && (toStateName === 'Login' || toStateName === 'Register')) {
        event.preventDefault(); // stop current execution
        $state.go('Home');
    } else if (!isLoggedIn && toStateName !== 'Register' && toStateName !== 'Login') {
        event.preventDefault(); // stop current execution
        $state.go('Login');
    } // else LET THEM PASS
}

function OnRun($rootScope, AppSettings, UserAuthService, $state) {
    'ngInject';

    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        const toStateName = toState.name;
        $rootScope.pageTitle = '';


        if (toState.title) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }

        // http://stackoverflow.com/questions/27212182/angularjs-ui-router-how-to-redirect-to-login-page
        // home is always allowed
        console.log('ToState', toStateName);
        if(toStateName === 'Home') {
            return;
        }
        UserAuthService.getUserId()
            .then(function (userId) {
                hasPermission(userId, toStateName, event, $state)
            })
            .catch(function (err) {
                console.log('onRunErr', err);
            });
        // if(isLoggedIn) {
        //     hasPermission(isLoggedIn, toStateName, event, $state)
        // } else {
        //     UserAuthService
        //         .fetchIsLoggedIn()
        //         .then(function () {
        //             hasPermission(UserAuthService.isLoggedIn(), toStateName, event, $state);
        //         });
        // }


        $rootScope.pageTitle += AppSettings.appTitle;


    });

}

export default OnRun;
