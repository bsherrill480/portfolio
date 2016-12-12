const _ = require('lodash');

function TopicsCtrl(EventGeneratorService, $q, $state) {
    'ngInject';
    const $ctrl = this;
    $ctrl.$onInit = function () {
        $ctrl.topics = [];
        $ctrl.isValid = true;
        EventGeneratorService
            .getAllTopicsForUser()
            .then(function (topics) {
                console.log('got topics', topics);
                $ctrl.topics = topics;
            });

        $ctrl.onSave = function (topics) {
            const promises = [];
            if(EventGeneratorService.isValidFromTopics(topics)) {
                console.log('isValid');
                $ctrl.isValid = true;
                _.each(
                    EventGeneratorService.getEventGeneratorsFromTopics(topics),
                    function (eventGenerator) {
                        promises.push(EventGeneratorService.createEventGenerator(eventGenerator));
                    }
                );
                $q
                    .all(promises)
                    .then(function () {
                        $state.go('MyEvents');
                    })
                    .catch(function (err) {
                        console.log('err', err);
                    });
            } else {
                $ctrl.isValid = false;
            }
        }
    }
}

function topicsCmpnt() {
    return {
        templateUrl: 'components/events_suggestions/topics.html',
        controller: TopicsCtrl
    }
}


export default {
    name: 'topics',
    fn: topicsCmpnt
};
