const _ = require('lodash');

// function generatorTypeToName(generatorTypes, generatorType) {
//     switch (generatorType) {
//         case generatorTypes.HOMEOWNER:
//             return 'Home events';
//         case generatorTypes.CAR_OWNER:
//             return 'Car events';
//         case generatorTypes.MEDICINE_TAKER:
//             return 'Medicine events';
//         case generatorTypes.CUSTOM:
//             return 'Custom events';
//         default:
//             return 'Not Found';
//     }
// }

function createEventGeneratorsTopics(EventGeneratorService, eventGenerators) {
    const typeToEventGeneratorList = {},
        eventGeneratorTopics = [];
    // build buckets
    _.forOwn(EventGeneratorService.getGeneratorTypes(), function (key, value) {
        typeToEventGeneratorList[value] = [];
    });

    // put in buckets
    _.each(eventGenerators, function (eventGenerator) {
        typeToEventGeneratorList[eventGenerator.generatorType].push(eventGenerator);
    });

    // build list
    _.forOwn(typeToEventGeneratorList, function (value, key) {
        const eventGeneratorTopic = {
            name: EventGeneratorService.generatorTypeToName(key),
            generatorType: key,
            eventGenerators: value
        };
        eventGeneratorTopics.push(eventGeneratorTopic);
    });
    return eventGeneratorTopics;
}

function MyEventsCtrl(EventGeneratorService) {
    'ngInject';
    const $ctrl = this;

    $ctrl.showPast = false;

    $ctrl.eventGeneratorsTopics = [];
    EventGeneratorService
        .getEventGeneratorsForUser()
        .then(function (eventGenerators) {
            $ctrl.topics = createEventGeneratorsTopics(
                EventGeneratorService,
                eventGenerators
            )
        })
        .catch(function (err) {
            console.log('err', err);
        });
}

function myEventsCmpnt() {
  return {
    templateUrl: 'components/my_events/my_events.html',
    controller: MyEventsCtrl
  }
}

export default {
  name: 'myEvents',
  fn: myEventsCmpnt
};
