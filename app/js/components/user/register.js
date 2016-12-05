function RegisterCtrl($state, UserService) {
    'ngInject';
    const vm = this,
        USERNAME_REQUIRED_MSG = 'Username required.',
        VERIFY_PASSWORD_NOT_MATCHING_MSG = 'Passwords do not match.',
        VERIFY_PASSWORD_REQUIRED_MSG = 'Verify password does not match',
        PASSWORD_REQUIRED_MSG = 'Password required.',
        ERROR = 'Error';

    vm.$onInit = () => {
        vm.user = {
            username: '',
            password: '',
            verifyPassword: ''
        };
        vm.errors = {
            username: '',
            password: '',
            verifyPassword: '',
            alertError: ''
        };
    };

    function validInputs (user) {
        const usernameValid = user.username,
            passwordValid = user.password,
            verifyPasswordRequired = user.verifyPassword,
            verifyPasswordMatches = user.verifyPassword === user.password,
            allValid = usernameValid && passwordValid && verifyPasswordMatches;
        let verifyPasswordMsg;

        vm.errors.username = usernameValid ? '' : USERNAME_REQUIRED_MSG;
        vm.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        if(!verifyPasswordRequired) {
            verifyPasswordMsg = VERIFY_PASSWORD_REQUIRED_MSG;
        } else if(!verifyPasswordMatches) {
            verifyPasswordMsg = VERIFY_PASSWORD_NOT_MATCHING_MSG;
        } else {
            verifyPasswordMsg = '';
        }
        vm.errors.verifyPassword = verifyPasswordMsg;
        vm.errors.alertError = allValid ? '' : ERROR;
        return allValid;
    }


    vm.register = function(userCred) {
        if(validInputs(userCred)) {
            const user = {
                username: userCred.username,
                password: userCred.password
            },
                promise = UserService.createUser(user);
            promise
                .then(function (payload) {
                    $state.go('Profile', {userId: payload._id});
                })
                .catch(function () {
                    // $window.alert('Unable to login');
                });
        }
    };
}

function registerCmpnt() {
    return {
        templateUrl: 'components/user/register.html',
        controller: RegisterCtrl,
        bindings: {
            user: '<',
            errors: '<',
            register: '&'
        }
    }
}


export default {
    name: 'register',
    fn: registerCmpnt
};
