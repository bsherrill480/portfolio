function GoogleService() {
    'ngInject';

    const service = {};

    service.googleAuth = function() {
        window.location = '/api/auth/google/connect';
    };



    return service;

}

export default {
    name: 'GoogleService',
    fn: GoogleService
};
