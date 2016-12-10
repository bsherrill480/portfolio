/**
 * Created by brian on 12/9/16.
 */
function HomeLoggedInCtrl() {
}

function homeLoggedIn() {
    return {
        transclude: true,
        templateUrl: 'components/home/home_logged_in.html',
        controller: HomeLoggedInCtrl
    }
}


export default {
    name: 'homeLoggedIn',
    fn: homeLoggedIn
};
