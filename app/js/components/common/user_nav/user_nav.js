// user nav at the top of all pages
function UserNavCtrl(UserAuthService) {
    'ngInject';
    const $ctrl = this;
    this.$onInit = function () {
        $ctrl.isLoggedIn = UserAuthService.isLoggedIn();
        if(!$ctrl.isLoggedIn) {
            UserAuthService
                .fetchIsLoggedIn()
                .then(function () {
                    $ctrl.isLoggedIn = UserAuthService.isLoggedIn();
                })
        }
    }
}

function userNav() {
    return {
        templateUrl: 'components/common/user_nav/user_nav.html',
        controller: UserNavCtrl,
        bindings: {
            isLoggedIn: '<'
        }
    }
}


export default {
    name: 'userNav',
    fn: userNav
};
