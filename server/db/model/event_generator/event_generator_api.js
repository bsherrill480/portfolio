'use strict';

const EventGenerator = require('./event_generator_model'),
    eventGeneratorUtil = require('./event_generator_util'),
    reminderUtil = require('../reminder/reminder_util'),
    Promise = require('bluebird'),
    reminderAPI = require('../reminder/reminder_api');

//all functions return promises
module.exports = {
    // createEventGenerator(userId, sentEventGenerator) {
    //     const eventGenerator = new EventGenerator(sentEventGenerator);
    //     eventGenerator._user = userId;
    //     eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
    //     return eventGenerator.save();
    // },

    createEventGenerator(userId, sentEventGenerator) {
        const eventGenerator = new EventGenerator(sentEventGenerator);
        eventGenerator._user = userId;
        eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
        return new Promise(function (resolve, reject) {
            eventGenerator.save()
                .then(function (eventGeneratorSaved) {
                    reminderUtil.generateAndSaveRemindersFromEventGenerator(eventGeneratorSaved)
                        .then(function () {
                            resolve(eventGeneratorSaved)
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
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
            });
        return query.exec();
    },

    findEventGeneratorById(eventGeneratorId) {
        return EventGenerator.findById(eventGeneratorId).exec();
    },

    // updateEventGenerator(eventGeneratorId, eventGenerator) {
    //     eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
    //     return EventGenerator.findByIdAndUpdate(eventGeneratorId, eventGenerator, {new: true}).exec();
    // },

    updateEventGenerator(eventGeneratorId, eventGenerator) {
        eventGeneratorUtil.addNextEventDateToEventGenerator(eventGenerator);
        return new Promise(function (resolve, reject) {
            EventGenerator.findByIdAndUpdate(eventGeneratorId, eventGenerator, {new: true}).exec()
                .then(function (eventGeneratorUpdated) {
                    reminderAPI.deleteRemindersForEventGenerator(eventGeneratorId)
                        .then(function () {
                            reminderUtil
                                .generateAndSaveRemindersFromEventGenerator(eventGeneratorUpdated)
                                .then(function () {
                                    resolve(eventGeneratorUpdated);
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    },

    deleteEventGenerator(eventGeneratorId) {
        // consider ordering here, which way would be better if one failed?
        return new Promise(function (resolve, reject) {
            reminderAPI.deleteRemindersForEventGenerator()
                .then(function () {
                    EventGenerator.findByIdAndRemove(eventGeneratorId).exec()
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
};
