function CalendarCtrl(moment, calendarConfig) {
    'ngInject';
    var vm = this;
    vm.$onInit = function () {

        vm.events = [{
            title: 'No event end date',
            startsAt: moment().hours(3).minutes(0).toDate(),
            color: calendarConfig.colorTypes.info
        }, {
            title: 'No event end date',
            startsAt: moment().hours(5).minutes(0).toDate(),
            color: calendarConfig.colorTypes.warning
        }];

        vm.calendarView = 'day';
        vm.viewDate = new Date();
        console.log('calendar', this.events, this.calendarView, this.viewDate)
        console.log('calendar', this)
    }

}

function calendar() {
    return {
        templateUrl: 'components/home/calendar.html',
        controller: CalendarCtrl,
        bindings: {
            events: '<',
            calendarView: '<',
            viewDate: '<'
        }
    }
}


export default {
    name: 'calendar',
    fn: calendar
};
