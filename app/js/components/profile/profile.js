function ProfileCtrl(UserAuthService, UserService, ResponseService, $state) {
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

    UserAuthService.getUserId()
        .then(function (userId) {
            UserService.findUserById(userId)
                .then(function (result) {
                    $ctrl.user = result;
                })
                .catch(function (err) {
                    console.log('ProfileCtrl UserAuthService.getUserId UserService.findUserById' +
                        ' err', err);
                })
        })
        .catch(function (err) {
            console.log('ProfileCtrl UserAuthService.getUserId err', err);
        });

    function validInputs (user) {
        const passwordValid = user.password,
            emailValid = user.email.length >= 3 && user.email.indexOf('@') >= 1,
            allValid = passwordValid && emailValid;

        $ctrl.errors.password = passwordValid ? '' : PASSWORD_REQUIRED_MSG;
        $ctrl.errors.email = emailValid ? '' : EMAIL_REQUIRED_MSG;
        return allValid;
    }

    $ctrl.onFacebookAuthenticate = function () {
        window.location = '/api/auth/facebook/connect';
    };

    $ctrl.profile = function(userCred) {
        if(validInputs(userCred)) {
            const user = {
                password: userCred.password,
                email: userCred.email
            };
            UserAuthService
                .profile(user)
                .then(function () {
                    $state.go('Home');
                })
                .catch(function (err) {
                    ResponseService.alertResponseError('Error logging in.', err);
                });
        }
    };
}

function profile() {
    return {
        templateUrl: 'components/profile/profile.html',
        controller: ProfileCtrl
    }
}


export default {
  name: 'profile',
  fn: profile
};
