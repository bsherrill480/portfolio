function EventsService($http) {
    'ngInject';
    return {
        getGoogleEvents() {
            return $http({
                method: 'GET',
                url: '/api/events/google_events'
            }).then(function (payload) {
                return payload.data;
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
