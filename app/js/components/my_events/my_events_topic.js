const _ = require('lodash'),
    moment = require('moment');

function MyEventsTopicCtrl(EventGeneratorService) {
    'ngInject';

    const $ctrl = this;

    $ctrl.showEventGen = function (eventGenerator) {
        const startOfToday = moment().startOf('day');
        console.log('eventGenerator:', eventGenerator);
        return eventGenerator.isReoccurring ||
            $ctrl.showPast ||
            moment(eventGenerator.date).isSameOrAfter(startOfToday)
    };

    $ctrl.onDeleteEventGenerator = function (eventGeneratorId) {
        _.remove($ctrl.topic.eventGenerators, function (eventGenerator) {
            return eventGenerator._id == eventGeneratorId;
        });
        EventGeneratorService.deleteEventGenerator(eventGeneratorId);
    };

    $ctrl.addEvent = function () {
        EventGeneratorService.createEventGenerator({
            question: '',
            date: new Date(),
            intervalYear: 0,
            intervalMonth: 0,
            intervalDay: 0,
            generatorType: $ctrl.topic.generatorType
        }).then(function (eventGenerator) {
            $ctrl.topic.eventGenerators.unshift(eventGenerator);
        });
    };
}

function myEventsTopicCmpnt() {
    return {
        templateUrl: 'components/my_events/my_events_topic.html',
        controller: MyEventsTopicCtrl,
        bindings: {
            topic: '<',
            showPast: '<'
        }
    }
}

export default {
  name: 'myEventsTopic',
  fn: myEventsTopicCmpnt
};
