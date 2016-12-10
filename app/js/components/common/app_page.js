// Serves as the outer template for all pages
function AppPageCtrl() {
}

function appPage() {
    return {
        transclude: true,
        templateUrl: 'components/common/app_page.html',
        controller: AppPageCtrl
    }
}


export default {
    name: 'appPage',
    fn: appPage
};
