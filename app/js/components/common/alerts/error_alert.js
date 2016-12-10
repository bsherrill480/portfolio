function ErrorAlertCtrl() {
}

function errorAlertCmpnt() {
    return {
        templateUrl: 'components/alerts/error_alert.html',
        controller: ErrorAlertCtrl,
        bindings: {
            msg: '='
        }
    }
}


export default {
    name: 'errorAlert',
    fn: errorAlertCmpnt
};
