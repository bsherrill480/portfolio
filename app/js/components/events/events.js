function EventsCtrl() {
}

function eventsCmpnt() {
  return {
    templateUrl: 'components/events/events.html',
    controller: EventsCtrl
  }
}


export default {
  name: 'events',
  fn: eventsCmpnt
};
