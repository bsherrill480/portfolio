function SocialSignInCtrl() {
    const $ctrl = this;

    $ctrl.onGoogleSignIn = function () {
        window.location = '/api/auth/google'
    };

    $ctrl.onFacebookSignIn = function () {
        window.location = '/api/auth/facebook'
    };
}

function socialSignInCmpnt() {
  return {
    templateUrl: 'components/common/buttons/social_sign_in.html',
    controller: SocialSignInCtrl,
    bindings: {
      hero: '<'
    }
  }
}


export default {
  name: 'socialSignIn',
  fn: socialSignInCmpnt
};
