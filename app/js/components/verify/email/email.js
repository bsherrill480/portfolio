function VerifyEmailCtrl(UserAuthService, $stateParams, ResponseService) {
    'ngInject';
    const $ctrl = this,
        code = $stateParams.code;
    $ctrl.loading = true;
    $ctrl.success = false;
    UserAuthService.confirmVerificationEmail(code)
        .then(function (res) {
            $ctrl.loading = false;
            $ctrl.success = !res.error;
        })
        .catch(function (err) {
            ResponseService.alertResponseError('Failed to check verification email', err)
        })

}

function verifyEmail() {
    return {
        templateUrl: 'components/verify/email/email.html',
        controller: VerifyEmailCtrl
    }
}


export default {
  name: 'verifyEmail',
  fn: verifyEmail
};
