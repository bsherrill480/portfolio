'use strict';

const BadEmail = require('./event_generator_model');

//all functions return promises
module.exports = {
    createBadEmail(email) {
        const badEmail = new BadEmail();
        badEmail.email = email;
        return badEmail.save();
    },

    badEmailExists(email) {
        return BadEmail.find({email: email})
    }
};
