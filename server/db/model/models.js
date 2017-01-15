'use strict';

const userAPI = require('./user/user_api'),
    eventGeneratorAPI = require('./event_generator/event_generator_api'),
    badEmailAPI = require('./bad_email/bad_email_api'),
    reminderAPI = require('./reminder/reminder_api');

module.exports = {
    userAPI,
    eventGeneratorAPI,
    badEmailAPI,
    reminderAPI
};
