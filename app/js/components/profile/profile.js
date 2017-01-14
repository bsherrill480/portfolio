function ProfileCtrl(UserAuthService, UserService, ResponseService, $state, GoogleService) {
    'ngInject';
    const $ctrl = this;
    $ctrl.user = {
        email: '',
        password: ''
    };

    $ctrl.emailStates = UserAuthService.getEmailStates();

    $ctrl.verificationEmailResent = false;

    $ctrl.isLoaded = false;

    UserAuthService.getUserId()
        .then(function (userId) {
            UserService.findUserById(userId)
                .then(function (result) {
                    $ctrl.user = result;
                    $ctrl.isLoaded = true;
                })
                .catch(function (err) {
                    console.log('ProfileCtrl UserAuthService.getUserId UserService.findUserById' +
                        ' err', err);
                })
        })
        .catch(function (err) {
            console.log('ProfileCtrl UserAuthService.getUserId err', err);
        });

    $ctrl.onGoogleAuthenticate = GoogleService.googleAuth;

    $ctrl.resendVerification = function () {
        $ctrl.verificationEmailResent = true;
        UserAuthService.sendVerificationEmail();
    };

    $ctrl.save = function(user) {
        const updatedUser = {
            allowEventEmails: user.allowEventEmails
        };

        UserService
            .updateUser(user._id, updatedUser)
            .catch(function (err) {
                ResponseService.alertResponseError('Error logging in.', err);
            });
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
