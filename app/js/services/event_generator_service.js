const HOMEOWNER = 'HOMEOWNER',
    CAR_OWNER = 'CAR_OWNER',
    MEDICINE_TAKER = 'MEDICINE_TAKER',
    CUSTOM = 'CUSTOM',
    _ = require('lodash'),
    moment = require('moment'),
    GENERATOR_TYPES = {
        HOMEOWNER,
        CAR_OWNER,
        MEDICINE_TAKER,
        CUSTOM
    };

function EventGeneratorService($http, $q) {
    'ngInject';

    return {
        getGeneratorTypes() {
            return GENERATOR_TYPES
        },

        getEventGeneratorsFromTopics(topics) {
            const eventGenerators = [];
            // build eventGenerators
            _.each(topics, function (topic) {
                if (topic.isSet) {
                    _.each(topic.eventGenerators, function (eventGenerator) {
                        if (eventGenerator.isSet) {
                            if (eventGenerator.uiDate) {
                                eventGenerator.date = moment(
                                    eventGenerator.uiDate,
                                    'MM/dd/yyyy'
                                ).toDate();
                            } else {
                                eventGenerator.date = null;
                            }
                            eventGenerators.push(eventGenerator);
                        }
                    })
                }
            });
            return eventGenerators;
        },

        isValidFromTopics(topics) {
            return _.reduce(this.getEventGeneratorsFromTopics(topics), function (acc, topic) {
                return acc && topic.date;
            }, true);
        },

        getAllTopicsForUser() {
            const deferred = $q.defer();
            deferred.resolve([
                { // topic
                    name: 'Homeowner',
                    isSet: false,
                    eventGenerators: [
                        {
                            isSet: false,
                            question: 'Get my roof inspected',
                            date: null,
                            uiDate: null,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: HOMEOWNER,
                            isReoccurring: true
                        },
                        {
                            isSet: false,
                            question: 'Replace my smoke alarms',
                            date: null,
                            uiDate: null,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: HOMEOWNER,
                            isReoccurring: true
                        }
                    ]
                },
                {
                    name: 'Car owner',
                    isSet: false,
                    eventGenerators: [
                        {
                            isSet: false,
                            question: 'Have my oil changed',
                            date: null,
                            uiDate: null,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: CAR_OWNER,
                            isReoccurring: true
                        },
                        {
                            isSet: false,
                            question: 'Have my tires changed',
                            date: null,
                            uiDate: null,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: CAR_OWNER,
                            isReoccurring: true
                        }
                    ]
                },
                {
                    name: 'Medicine taker',
                    isSet: false,
                    eventGenerators: [
                        {
                            isSet: false,
                            question: 'Get A refill of my prescription',
                            date: null,
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: MEDICINE_TAKER,
                            isReoccurring: true
                        },
                        {
                            isSet: false,
                            question: 'Have my tires changed',
                            date: new Date(2016, 12, 31),
                            intervalYear: 0,
                            intervalMonth: 0,
                            intervalDay: 0,
                            generatorType: MEDICINE_TAKER,
                            isReoccurring: true
                        }
                    ]
                }

            ]);
            return deferred.promise;
        },

        createEventGenerator(eventGenerator) {
            return $http({
                method: 'POST',
                url: '/api/event_generator/',
                data: eventGenerator
            }).then(function (payload) {
                return payload.data;
            });
        },
        
        getEventGenerator(eventGenerator) {
            return $http({
                method: 'GET',
                url: '/api/event_generator/' + eventGenerator._id
            }).then(function (payload) {
                return payload.data;
            });
        },

        getEventGeneratorsForUser() {
            return $http({
                method: 'GET',
                url: '/api/event_generator/'
            }).then(function (payload) {
                const payloadData = payload.data;
                _.each(payloadData, function (eventGenerator) {
                    eventGenerator.date = new Date(eventGenerator.date)
                });
                return payloadData;
            });
        },

        updateEventGenerator: function (eventGenerator) {
            return $http({
                method: 'PUT',
                url: '/api/event_generator/' + eventGenerator._id,
                data: eventGenerator
            });
        },

        deleteEventGenerator: function (eventGeneratorId) {
            return $http({
                method: 'DELETE',
                url: '/api/event_generator/' + eventGeneratorId
            });
        },
        
        generatorTypeToName(generatorType) {
            // could also be done with an object
            switch (generatorType) {
                case GENERATOR_TYPES.HOMEOWNER:
                    return 'Home events';
                case GENERATOR_TYPES.CAR_OWNER:
                    return 'Car events';
                case GENERATOR_TYPES.MEDICINE_TAKER:
                    return 'Medicine events';
                case GENERATOR_TYPES.CUSTOM:
                    return 'Custom events';
                default:
                    return 'Not Found';
            }
        },
        
        
    }
}

export default {
    name: 'EventGeneratorService',
    fn: EventGeneratorService
};
