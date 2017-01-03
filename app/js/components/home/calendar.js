const _ = require('lodash'),
    moment = require('moment'),
    MAX_EVENTS_DATE = moment();
MAX_EVENTS_DATE.add(2, 'years');

function isOneOffEventGenerator(eventGenerator) {
    return !eventGenerator.intervalYear &&
        !eventGenerator.intervalMonth &&
        !eventGenerator.intervalDay;
}

function generateEvent(eventGenerator, momentDate) {
    // console.log('generateEvent');
    return {
        title: eventGenerator.question,
        color: {
            primary: '#1e90ff',
            secondary: '#d1e8ff'
        },
        startsAt: momentDate.toDate(),
        endsAt: moment(momentDate).startOf('day').add(23, 'hours').add(59, 'minutes').toDate(),
        draggable: false,
        resizeable: false,
        actions: [{
            label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
            onClick: function(args) {
                console.log('Edited', args.calendarEvent);
            }
        }]
    }
}

function incrementEventDate(eventGenerator, momentDate) {
    // console.log('incrementEventDate');
    momentDate.add(eventGenerator.intervalDay, 'days');
    momentDate.add(eventGenerator.intervalMonth, 'Months');
    momentDate.add(eventGenerator.intervalYear, 'Years');
}

function generateEventsFromEventGenerators(eventGenerators) {
    const events = [];
    _.each(eventGenerators, function (eventGenerator) {
        const curDate = moment(eventGenerator.date);
        if(isOneOffEventGenerator(eventGenerator)) {
            events.push(generateEvent(eventGenerator, curDate));
        } else {
            while(curDate.isBefore(MAX_EVENTS_DATE)) {
                events.push(generateEvent(eventGenerator, curDate));
                incrementEventDate(eventGenerator, curDate);
            }
        }
    });
    return events;
}

function formatGoogleEvents(events) {
    return _.map(events, function (googleEvent) {
        return {
            title: googleEvent.summary,
            color: {
                primary: '#006400',
                secondary: '#caffca'
            },
            startsAt: moment(googleEvent.start.date).toDate(),
            endsAt: moment(googleEvent.end.date).toDate(),
            draggable: false,
            resizeable: false
        }
    })
}

function CalendarCtrl(EventsService, $q, EventGeneratorService) {
    'ngInject';
    const now = moment().startOf('day'),
        twoWeeksFromNow = moment(now).add(2, 'weeks').endOf('day');
    //set now to be start of today. Set 2 weeks from now to be end of day.

    var vm = this;
    vm.$onChanges = function (obj) {
        console.log('on Changes', obj)
    };
    vm.$onInit = function () {
        let googleEventsFinished,
            generatedEvents;
        const googleEventsPromise = EventsService
            .getGoogleEvents()
            .then(function (googleEvents) {
                googleEventsFinished = formatGoogleEvents(googleEvents);
            }),
            eventGeneratorsPromise = EventGeneratorService
                .getEventGeneratorsForUser()
                .then(function (eventGenerators) {
                    generatedEvents = generateEventsFromEventGenerators(eventGenerators);
                })
                .catch(function (err) {
                    console.log('eventGeneratorsPromiseErr', err);
                }),
            promises = [googleEventsPromise, eventGeneratorsPromise];
        $q.all(promises)
            .then(function () {
                let upcomingEvents;

                vm.events = googleEventsFinished.concat(generatedEvents);

                upcomingEvents = _.filter(vm.events, function (event) {
                    const evntDate = moment(event.startsAt);
                    return evntDate.isSameOrBefore(twoWeeksFromNow) && evntDate.isSameOrAfter(now);
                });
                upcomingEvents = _.sortBy(upcomingEvents, (event) => event.startsAt);
                vm.upcomingEvents = upcomingEvents;
            });

        // https://mattlewis92.github.io/angular-bootstrap-calendar/#?example=kitchen-sink
        //These variables MUST be set as a minimum for the calendar to work
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.events = [];


        vm.cellIsOpen = true;

        vm.timespanClicked = function(date, cell) {
            console.log('timespan clicked');
            if (vm.calendarView === 'month') {
                if ((vm.cellIsOpen &&
                    moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) ||
                    cell.events.length === 0 ||
                    !cell.inMonth) {
                    vm.cellIsOpen = false;
                } else {
                    console.log('setting open, viewdate', date);
                    vm.viewDate = date;
                    vm.cellIsOpen = true;
                }
            }
        //     } else if (vm.calendarView === 'year') {
        //         if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
        //             vm.cellIsOpen = false;
        //         } else {
        //             vm.cellIsOpen = true;
        //             vm.viewDate = date;
        //         }
        //     }
        };
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
