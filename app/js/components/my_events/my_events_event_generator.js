function MyEventsEventGeneratorCtrl(EventGeneratorService) {
    'ngInject';
    const $ctrl = this;
    $ctrl.$onInit = function () {
        $ctrl.pickerOpen = false;
        $ctrl.openPicker = function () {
            $ctrl.pickerOpen = true;
        };
        $ctrl.onUpdate = function (eventGenerator) {
            console.log('onUpdateEventCtrl', eventGenerator);
            EventGeneratorService.updateEventGenerator(eventGenerator);
        };
    }
}

function myEventsEventGeneratorCmpnt() {
    return {
        templateUrl: 'components/my_events/my_events_event_generator.html',
        controller: MyEventsEventGeneratorCtrl,
        bindings: {
            eventGenerator: '<',
            showPast: '<',
            onDelete: '&'
        }
    }
}

export default {
  name: 'myEventsEventGenerator',
  fn: myEventsEventGeneratorCmpnt
};
