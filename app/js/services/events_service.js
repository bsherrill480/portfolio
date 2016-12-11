function EventsService($q) {
  'ngInject';

  return {
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
                          defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
                      },
                      {
                          isSet: false,
                          question: 'Replace my smoke alarms',
                          date: null,
                          defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
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
                          defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
                      },
                      {
                          isSet: false,
                          question: 'Have my tires changed',
                          date: new Date(2016, 12, 31),
                          defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
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
                           defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
                       },
                       {
                           isSet: false,
                           question: 'Have my tires changed',
                           date: new Date(2016, 12, 31),
                           defaultIntervalOptions: [365, 730],
                          intervalYear: 0,
                          intervalMonth: 0,
                          intervalDay: 0
                       }
                   ]
               }

          ]);
          return deferred.promise;
      }
  };
}

export default {
  name: 'EventsService',
  fn: EventsService
};
