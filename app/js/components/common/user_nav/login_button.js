function LoginButtonCtrl() {
}

function loginButton() {
  return {
      templateUrl: 'components/common/user_nav/login_button.html',
      controller: LoginButtonCtrl
  }
}


export default {
  name: 'loginButton',
  fn: loginButton
};
