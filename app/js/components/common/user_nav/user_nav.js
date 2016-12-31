// user nav at the top of all pages
function UserNavCtrl(UserAuthService) {
    'ngInject';
    const $ctrl = this;

    UserAuthService.getUserId()
        .then(function (userId) {
            $ctrl.isLoggedIn = userId;
        })
        .catch(function (err) {
            console.log('UserNavCtrl UserAuthService.getUserId err', err);
        });

    this.$onInit = function () {
        // $ctrl.isLoggedIn = UserAuthService.isAlreadyLoggedIn();
        // if(!$ctrl.isLoggedIn) {
        //     UserAuthService
        //         .fetchIsLoggedIn()
        //         .then(function () {
        //             $ctrl.isLoggedIn = UserAuthService.isLoggedIn();
        //         })
        // }
        $ctrl.logout = function () {
            UserAuthService.logout().then(function () {
                window.location.reload();
            });
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
