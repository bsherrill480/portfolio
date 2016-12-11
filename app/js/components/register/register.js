function RegisterCtrl(UserAuthService, ResponseService, $window, $state) {
    'ngInject';
    const $ctrl = this,
        EMAIL_REQUIRED_MSG = 'Valid email required.',
        VERIFY_PASSWORD_NOT_MATCHING_MSG = 'Passwords do not match.',
        VERIFY_PASSWORD_REQUIRED_MSG = 'Verify password does not match',
        PASSWORD_REQUIRED_MSG = 'Password required.';

    $ctrl.$onInit = () => {
        $ctrl.user = {
            email: '',
            password: '',
            verifyPassword: ''
        };
        $ctrl.errors = {
            email: '',
            password: '',
            verifyPassword: ''
        };
    };

    function validInputs (user) {
        const passwordValid = user.password,
            emailValid = user.email.length >= 3 && user.email.indexOf('@') >= 1,
            verifyPasswordRequired = user.verifyPassword,
            verifyPasswordMatches = user.verifyPassword === user.password,
            allValid = passwordValid && verifyPasswordMatches && emailValid;
        let verifyPasswordMsg;

        $ctrl.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        $ctrl.errors.email = emailValid ? '' : EMAIL_REQUIRED_MSG;
        if(!verifyPasswordRequired) {
            verifyPasswordMsg = VERIFY_PASSWORD_REQUIRED_MSG;
        } else if(!verifyPasswordMatches) {
            verifyPasswordMsg = VERIFY_PASSWORD_NOT_MATCHING_MSG;
        } else {
            verifyPasswordMsg = '';
        }
        $ctrl.errors.verifyPassword = verifyPasswordMsg;
        return allValid;
    }


    $ctrl.register = function(userCred) {
        if(validInputs(userCred)) {
            const user = {
                password: userCred.password,
                email: userCred.email
            },
                promise = UserAuthService.register(user);
            promise
                .then(function () {
                    $state.go('Home');
                })
                .catch(function (err) {
                    ResponseService.alertResponseError('Error signing up.', err);
                });
        }
    };
}

function register() {
    return {
        templateUrl: 'components/register/register.html',
        controller: RegisterCtrl
    }
}


export default {
  name: 'register',
  fn: register
};
