'use strict';

const EventGenerator = require('./event_generator_model');

//all functions return promises
module.exports = {
    createEventGenerator(userId, sentEventGenerator) {
        const eventGenerator = new EventGenerator(sentEventGenerator);
        eventGenerator._user = userId;
        return eventGenerator.save();
    },

    findAllEventGeneratorsForUser(userId) {
        return EventGenerator.find({_user: userId})
    },

    findEventGeneratorById(eventGeneratorId) {
        return EventGenerator.findById(eventGeneratorId).exec();
    },

    updateEventGenerator(eventGeneratorId, eventGenerator) {
        return EventGenerator.findByIdAndUpdate(eventGeneratorId, eventGenerator, {new: true}).exec();
    },

    deleteEventGenerator(eventGeneratorId) {
        return EventGenerator.findByIdAndRemove(eventGeneratorId).exec();
    }
};
