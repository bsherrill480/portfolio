// user nav at the top of all pages
function UserNavCtrl(UserAuthService) {
    'ngInject';
    const ctrl = this,
        user = UserAuthService.getListener();
    this.user = user;
    window.nav = ctrl;
    this.$onChanges = function () {
        console.log('on changes');
    };
    this.changeUser = function () {
        console.log('change user');
        ctrl.user.userId = '12';
    }
}

function userNav() {
    return {
        templateUrl: 'components/common/user_nav/user_nav.html',
        controller: UserNavCtrl,
        bindings: {
            user: '<'
        }
    }
}


export default {
    name: 'userNav',
    fn: userNav
};
