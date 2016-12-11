function EventGeneratorCtrl($scope) {
    'ngInject';
    const $ctrl = this;

    $ctrl.$onInit = function () {
        $ctrl.pickerOpen = false;
        $ctrl.openPicker = function () {
            $ctrl.pickerOpen = true;
        };

        $ctrl.editQuestion = false;
        $ctrl.invertEditQuestion = function () {
            $ctrl.editQuestion = !$ctrl.editQuestion;
        };

        $ctrl.editInterval = false;
         $ctrl.invertEditInterval = function () {
            $ctrl.editInterval = !$ctrl.editInterval;
        };
    }
}

function eventGeneratorCmpnt() {
    return {
        templateUrl: 'components/events/event_generator.html',
        controller: EventGeneratorCtrl,
        bindings: {
            eventGenerator: '='
        }
    }
}


export default {
    name: 'eventGenerator',
    fn: eventGeneratorCmpnt
};
