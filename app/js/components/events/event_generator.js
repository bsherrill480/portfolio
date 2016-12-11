function EventGeneratorCtrl() {
    const $ctrl = this;

    $ctrl.$onInit = function () {
        $ctrl.pickerOpen = false;
        $ctrl.openPicker = function () {
            $ctrl.pickerOpen = true;
        }
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
