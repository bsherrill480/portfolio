function LoginCtrl() {
  this.$onInit = () => {
    this.hero = 'spawn';
  }
}

function loginCmpnt() {
  return {
    templateUrl: 'components/user/login.html',
    controller: LoginCtrl,
    bindings: {
      hero: '<'
    }
  }
}


export default {
  name: 'login',
  fn: loginCmpnt
};
