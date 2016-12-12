const _ = require('lodash');

function generatorTypeToName(generatorTypes, generatorType) {
    switch (generatorType) {
        case generatorTypes.HOMEOWNER:
            return 'Home events';
        case generatorTypes.CAR_OWNER:
            return 'Car events';
        case generatorTypes.MEDICINE_TAKER:
            return 'Medicine events';
        case generatorTypes.CUSTOM:
            return 'Custom events';
        default:
            return 'Not Found';
    }
}

function createEventGeneratorsTopics(generatorTypes, eventGenerators) {
    const typeToEventGeneratorList = {},
        eventGeneratorTopics = [];
    // build buckets
    _.forOwn(generatorTypes, function (key, value) {
        typeToEventGeneratorList[value] = [];
    });

    // put in buckets
    _.each(eventGenerators, function (eventGenerator) {
        typeToEventGeneratorList[eventGenerator.generatorType].push(eventGenerator);
    });

    // build list
    _.forOwn(typeToEventGeneratorList, function (value, key) {
        const eventGeneratorTopic = {
            name: generatorTypeToName(generatorTypes, key),
            eventGenerators: value
        };
        eventGeneratorTopics.push(eventGeneratorTopic);
    });
    return eventGeneratorTopics;
}

function MyEventsCtrl(EventGeneratorService) {
    'ngInject';
    const $ctrl = this,
        generatorTypes = EventGeneratorService.getGeneratorTypes();
    $ctrl.$onInit = function () {
        $ctrl.eventGeneratorsTopics = [];
        EventGeneratorService
            .getEventGeneratorsForUser()
            .then(function (eventGenerators) {
                $ctrl.topics = createEventGeneratorsTopics(
                    generatorTypes,
                    eventGenerators
                )
            });
    }
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
