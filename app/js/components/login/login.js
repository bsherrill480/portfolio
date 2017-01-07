function LoginCtrl(UserAuthService, ResponseService, $state) {
    'ngInject';
    const $ctrl = this,
        EMAIL_REQUIRED_MSG = 'Valid email required.',
        PASSWORD_REQUIRED_MSG = 'Password required.';
    $ctrl.user = {
        email: '',
        password: ''
    };
    $ctrl.errors = {
        email: '',
        password: ''
    };

    function validInputs (user) {
        const passwordValid = user.password,
            emailValid = user.email.length >= 3 && user.email.indexOf('@') >= 1,
            allValid = passwordValid && emailValid;

        $ctrl.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        $ctrl.errors.email = emailValid ? '' : EMAIL_REQUIRED_MSG;
        return allValid;
    }


    $ctrl.login = function(userCred) {
        if(validInputs(userCred)) {
            const user = {
                password: userCred.password,
                email: userCred.email
            };
            UserAuthService
                .login(user)
                .then(function () {
                    $state.go('Home');
                })
                .catch(function (err) {
                    ResponseService.alertResponseError('Error logging in.', err);
                });
        }
    };
}

function login() {
    return {
        templateUrl: 'components/login/login.html',
        controller: LoginCtrl
    }
}


export default {
  name: 'login',
  fn: login
};
