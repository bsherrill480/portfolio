function ViewEventCtrl(EventGeneratorService, $stateParams) {
    'ngInject';
    const $ctrl = this;

    EventGeneratorService
        .getEventGenerator($stateParams.eventGeneratorId)
        .then(function (eventGenerator) {
            $ctrl.eventGenerator = eventGenerator;
        })
        .catch(function (err) {
            console.log('err', err);
        });
}

function viewEventCmpnt() {
  return {
    templateUrl: 'components/my_events/view_event.html',
    controller: ViewEventCtrl
  }
}

export default {
  name: 'viewEvent',
  fn: viewEventCmpnt
};
