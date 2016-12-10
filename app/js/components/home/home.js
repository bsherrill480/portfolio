/**
 * Created by brian on 12/9/16.
 */
function HomeCtrl(UserAuthService) {
    'ngInject';
    this.$onInit = function () {
        this.isLoggedIn = UserAuthService.isLoggedIn();
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
