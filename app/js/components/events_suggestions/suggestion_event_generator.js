function EventGeneratorCtrl() {
    'ngInject';
    const $ctrl = this;

    // $ctrl.$onInit = function () {
    $ctrl.pickerOpen = false;
    $ctrl.openPicker = function () {
        $ctrl.pickerOpen = true;
    };

    $ctrl.editQuestion = false;
    $ctrl.invertEditQuestion = function () {
        $ctrl.editQuestion = !$ctrl.editQuestion;
    };

}

function eventGeneratorCmpnt() {
    return {
        templateUrl: 'components/events_suggestions/suggestion_event_generator.html',
        controller: EventGeneratorCtrl,
        bindings: {
            eventGenerator: '='
        }
    }
}


export default {
    name: 'suggestionEventGenerator',
    fn: eventGeneratorCmpnt
};
