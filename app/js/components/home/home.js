/**
 * Created by brian on 12/9/16.
 */
function HomeCtrl() {
}

function home() {
    return {
        transclude: true,
        templateUrl: 'components/home/home.html',
        controller: HomeCtrl,
    }
}


export default {
    name: 'home',
    fn: home
};
