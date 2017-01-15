'use strict';

const EventGenerator = require('./event_generator_model'),
    eventGeneratorUtil = require('./event_generator_util');

//all functions return promises
module.exports = {
    createEventGenerator(userId, sentEventGenerator) {
        const eventGenerator = new EventGenerator(sentEventGenerator);
        eventGenerator._user = userId;
        eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
        return eventGenerator.save();
    },

    findAllEventGeneratorsForUser(userId) {
        return EventGenerator.find({_user: userId})
    },

    // returns [lower, upper)
    findEventGeneratorsByNextEventDate(lowerBound, upperBound) {
        const query = EventGenerator
            .find({
                nextEventDate: {
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
        eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
        return EventGenerator.findByIdAndUpdate(eventGeneratorId, eventGenerator, {new: true}).exec();
    },

    deleteEventGenerator(eventGeneratorId) {
        return EventGenerator.findByIdAndRemove(eventGeneratorId).exec();
    }
};
