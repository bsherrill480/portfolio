'use strict';

const EventGenerator = require('./event_generator_model'),
    eventGeneratorUtil = require('./event_generator_util');

//all functions return promises
module.exports = {
    createEventGenerator(userId, sentEventGenerator) {
        const eventGenerator = new EventGenerator(sentEventGenerator);
        eventGenerator._user = userId;
        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        return eventGenerator.save();
    },

    findAllEventGeneratorsForUser(userId) {
        return EventGenerator.find({_user: userId})
    },

    // returns [lower, upper) 
    findEventGeneratorsByNextReminderDate(lowerBound, upperBound) {
        const query = EventGenerator
            .find({
                nextReminderDate: {
                    $gte: lowerBound,
                    $lt: upperBound
                }
            })
            .populate('_user');
        return query.exec();
    },

    findEventGeneratorById(eventGeneratorId) {
        return EventGenerator.findById(eventGeneratorId).exec();
    },

    updateEventGenerator(eventGeneratorId, eventGenerator) {
        eventGeneratorUtil.addNextReminderDateToEventGenerator(eventGenerator);
        return EventGenerator.findByIdAndUpdate(eventGeneratorId, eventGenerator, {new: true}).exec();
    },

    deleteEventGenerator(eventGeneratorId) {
        return EventGenerator.findByIdAndRemove(eventGeneratorId).exec();
    }
};
