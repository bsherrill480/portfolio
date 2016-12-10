function OldLoginCtrl($state, UserService) {
    'ngInject';
    const vm = this,
        USERNAME_REQUIRED_MSG = 'Username required.',
        PASSWORD_REQUIRED_MSG = 'Password required.',
        BAD_CREDENTIALS_ALERT_MSG = 'Check username and password',
        ERROR = 'Error';

    vm.$onInit = () => {
        vm.errors = {
            username: '',
            password: '',
            alertError: ''
        };
        vm.user = {
            username: '',
            password: ''
        };
    };

    vm.validInputs = function() {
        var usernameValid = vm.user.username,
            passwordValid = vm.user.password,
            allValid = usernameValid && passwordValid;
        vm.errors.username = usernameValid ? '' : USERNAME_REQUIRED_MSG;
        vm.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        vm.errors.alertError = allValid ? '' : ERROR;
        return allValid;
    };

    vm.login = function(userCred) {
        var promise;
        if(validInputs()) {
            userCred = userCred || {};
            promise = UserService.loginUserByCredentials(userCred.username, userCred.password);
            promise
                .then(function () {
                    // $location.url("/user/" + user._id);
                    $state.go('Profile')
                })
                .catch(function (response) {
                    vm.errors.alertError =
                        response.status === 401 ?
                            BAD_CREDENTIALS_ALERT_MSG :
                            ERROR;
                    return response;
                });
        }
    }
}

function oldLoginCmpnt() {
    return {
        templateUrl: 'components/user/login.html',
        controller: OldLoginCtrl
    }
}


export default {
    name: 'oldLogin',
    fn: oldLoginCmpnt
};
