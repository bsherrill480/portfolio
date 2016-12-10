function RegisterCtrl() {
    'ngInject';
    const vm = this,
        EMAIL_REQUIRED_MSG = 'Valid email required.',
        VERIFY_PASSWORD_NOT_MATCHING_MSG = 'Passwords do not match.',
        VERIFY_PASSWORD_REQUIRED_MSG = 'Verify password does not match',
        PASSWORD_REQUIRED_MSG = 'Password required.',
        HAS_INPUT_ERROR_ALERT_MSG = 'Unable to register you, please fix errors below.';

    vm.$onInit = () => {
        vm.user = {
            email: '',
            password: '',
            verifyPassword: ''
        };
        vm.errors = {
            email: '',
            password: '',
            verifyPassword: '',
            alertError: ''
        };
    };

    function validInputs (user) {
        const passwordValid = user.password,
            emailValid = user.email.length >= 3 && user.email.indexOf('@') >= 1,
            verifyPasswordRequired = user.verifyPassword,
            verifyPasswordMatches = user.verifyPassword === user.password,
            allValid = passwordValid && verifyPasswordMatches && emailValid;
        let verifyPasswordMsg;

        vm.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        vm.errors.email = emailValid ? '' : EMAIL_REQUIRED_MSG;
        if(!verifyPasswordRequired) {
            verifyPasswordMsg = VERIFY_PASSWORD_REQUIRED_MSG;
        } else if(!verifyPasswordMatches) {
            verifyPasswordMsg = VERIFY_PASSWORD_NOT_MATCHING_MSG;
        } else {
            verifyPasswordMsg = '';
        }
        vm.errors.verifyPassword = verifyPasswordMsg;
        vm.errors.alertError = allValid ? '' : HAS_INPUT_ERROR_ALERT_MSG;
        return allValid;
    }


    vm.register = function(userCred) {
        if(validInputs(userCred)) {
            const user = {
                password: userCred.password,
                email: userCred.email
            },
                promise = UserService.createUser(user);
            promise
                .then(function (payload) {
                    $state.go('Profile', {userId: payload._id});
                })
                .catch(function () {
                    $window.alert("Error logging in.");
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
