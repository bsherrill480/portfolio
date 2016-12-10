/**
 * Created by brian on 12/9/16.
 */
function HomeLoggedOutCtrl() {
}

function homeLoggedOut() {
    return {
        transclude: true,
        templateUrl: 'components/home/home_logged_out.html',
        controller: HomeLoggedOutCtrl,
    }
}


export default {
    name: 'homeLoggedOut',
    fn: homeLoggedOut
};
