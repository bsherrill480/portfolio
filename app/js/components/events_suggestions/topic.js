function TopicCtrl() {
    'ngInject';
}

function topicCmpnt() {
    return {
        templateUrl: 'components/events_suggestions/topic.html',
        controller: TopicCtrl,
        bindings: {
            topic: '='
        }
    }
}


export default {
    name: 'topic',
    fn: topicCmpnt
};
