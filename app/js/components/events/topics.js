// const _ = require('lodash');

function TopicsCtrl(EventsService) {
    'ngInject';
    const $ctrl = this;
    $ctrl.$onInit = function () {
        $ctrl.topics = [];
        EventsService
            .getAllTopicsForUser()
            .then(function (topics) {
                console.log('got topics', topics);
                $ctrl.topics = topics;
            });
        // const panes = $ctrl.panes = [];
        // $ctrl.select = function(pane) {
        //     _.each(panes, function(pane) {
        //         pane.selected = false;
        //     });
        //     pane.selected = true;
        // };
        // $ctrl.addPane = function(pane) {
        //     console.log('add pane');
        //     if (panes.length === 0) {
        //         $ctrl.select(pane);
        //     }
        //     panes.push(pane);
        // };
    }
}

function topicsCmpnt() {
    return {
        templateUrl: 'components/events/topics.html',
        controller: TopicsCtrl
    }
}


export default {
    name: 'topics',
    fn: topicsCmpnt
};
