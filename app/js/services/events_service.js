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
                          question: 'When did you last have your roof inspected',
                          date: null,
                          defaultIntervalOptions: [365, 730],
                          interval: -1
                      },
                      {
                          isSet: false,
                          question: 'When did replace your smoke alarms',
                          date: null,
                          defaultIntervalOptions: [365, 730],
                          interval: -1
                      }
                  ]
              },
              {
                  name: 'Car owner',
                  isSet: false,
                  eventGenerators: [
                      {
                          isSet: false,
                          question: 'When did you last have your oil changed',
                          date: null,
                          defaultIntervalOptions: [365, 730],
                          interval: -1
                      },
                      {
                          isSet: false,
                          question: 'When did  your smoke alarms',
                          date: new Date(2016, 12, 31),
                          defaultIntervalOptions: [365, 730],
                          interval: -1
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
