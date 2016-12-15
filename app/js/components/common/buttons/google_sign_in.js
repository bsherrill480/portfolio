function GoogleSignInCtrl() {
}

function googleSignInCmpnt() {
  return {
    templateUrl: 'components/common/buttons/google_sign_in.html',
    controller: GoogleSignInCtrl,
    bindings: {
      hero: '<'
    }
  }
}


export default {
  name: 'googleSignInCmpnt',
  fn: googleSignInCmpnt
};
