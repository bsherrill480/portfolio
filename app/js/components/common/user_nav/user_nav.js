// user nav at the top of all pages
function UserNavCtrl(UserAuthService) {
    'ngInject';
    // UserAuthService;
    this.user = UserAuthService.getListener();
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
