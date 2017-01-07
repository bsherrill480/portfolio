function EventsService($http, GoogleService) {
    'ngInject';
    return {
        getGoogleEvents() {
            return $http({
                method: 'GET',
                url: '/api/events/google_events'
            }).then(function (payload) {
                const data = payload.data;
                if(data.error == 'REFRESH_AUTh') {
                    // window.location = '/'
                    GoogleService.googleAuth();
                    return [];
                } else {
                    return payload.data;
                }
            }).catch(function (err) {
                console.log('googleEventsErr', err);
                return [];
            });
        }
    };

}

export default {
    name: 'EventsService',
    fn: EventsService
};
