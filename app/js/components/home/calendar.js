function CalendarCtrl(moment, calendarConfig) {
    'ngInject';
    const alert = {
        show(event){
            console.log('alert', event);
        }
    }

    var vm = this;
    vm.$onInit = function () {
        // https://mattlewis92.github.io/angular-bootstrap-calendar/#?example=kitchen-sink
        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        var actions = [{
        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
            onClick: function(args) {
                alert.show('Edited', args.calendarEvent);
            }
        }, {
            label: '<i class=\'glyphicon glyphicon-remove\'></i>',
            onClick: function(args) {
                alert.show('Deleted', args.calendarEvent);
            }
        }];
        vm.events = [
            {
                title: 'An event',
                color: calendarConfig.colorTypes.warning,
                startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                draggable: false,
                resizable: false,
                actions: actions
            }, {
                title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
                color: calendarConfig.colorTypes.info,
                startsAt: moment().subtract(1, 'day').toDate(),
                draggable: false,
                resizable: false,
                actions: actions
            }, {
                title: 'This is a really long event title that occurs on every year',
                color: calendarConfig.colorTypes.important,
                startsAt: moment().startOf('day').toDate(),
                endsAt: moment().startOf('day').add(23, 'hours').add(59, 'minutes').toDate(),
                draggable: false,
                resizable: false,
                actions: actions
            }
        ];

        vm.cellIsOpen = true;

        vm.eventClicked = function(event) {
            alert.show('Clicked', event);
        };

        vm.eventEdited = function(event) {
            alert.show('Edited', event);
        };

        vm.eventDeleted = function(event) {
            alert.show('Deleted', event);
        };

        vm.eventTimesChanged = function(event) {
            alert.show('Dropped or resized', event);
        };

        vm.timespanClicked = function(date, cell) {
            console.log("timespan clicked");
            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            } else if (vm.calendarView === 'year') {
                if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
                    vm.cellIsOpen = false;
                } else {
                    vm.cellIsOpen = true;
                    vm.viewDate = date;
                }
            }

        };


        // vm.events = [{
        //     title: 'No event end date',
        //     startsAt: moment().hours(3).minutes(0).toDate(),
        //     color: calendarConfig.colorTypes.info
        // }, {
        //     title: 'No event end date',
        //     startsAt: moment().hours(5).minutes(0).toDate(),
        //     color: calendarConfig.colorTypes.warning
        // }];
        //
        // vm.calendarView = 'month';
        // vm.viewDate = new Date();
    }
}

function calendar() {
    return {
        templateUrl: 'components/home/calendar.html',
        controller: CalendarCtrl,
        controllerAs: 'vm'
    }
}


export default {
    name: 'calendar',
    fn: calendar
};
