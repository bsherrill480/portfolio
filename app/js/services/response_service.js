function ResponseService($window) {
    'ngInject';
    function alertResponseError(message, err) {
        const errorMsg = err && err.data && err.data.error ? err.data.error : '';
        $window.alert(message + ' ' + errorMsg);
    }
    
    
    return {
        alertResponseError: alertResponseError
    };

}

export default {
    name: 'ResponseService',
    fn: ResponseService
};
