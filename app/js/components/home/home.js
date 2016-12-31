/**
 * Created by brian on 12/9/16.
 */
function HomeCtrl(UserAuthService) {
    'ngInject';
    const $ctrl = this;
    UserAuthService.getUserId()
        .then(function (userId) {
            $ctrl.isLoggedIn = userId;
        })
        .catch(function (err) {
            console.log('HomeCtrl UserAuthService.getUserId err', err);
        });
    this.$onInit = function () {
        // $ctrl.isLoggedIn = UserAuthService.isLoggedIn();
        // if(!$ctrl.isLoggedIn) {
        //     UserAuthService
        //         .fetchIsLoggedIn()
        //         .then(function () {
        //             $ctrl.isLoggedIn = UserAuthService.isLoggedIn();
        //         })
        // }
    }
}

function home() {
    return {
        transclude: true,
        templateUrl: 'components/home/home.html',
        controller: HomeCtrl
    }
}


export default {
    name: 'home',
    fn: home
};
