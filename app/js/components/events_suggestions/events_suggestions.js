function EventsCtrl() {
}

function eventsCmpnt() {
  return {
    templateUrl: 'components/events_suggestions/events_suggestions.html',
    controller: EventsCtrl
  }
}


export default {
  name: 'eventsSuggestions',
  fn: eventsCmpnt
};
