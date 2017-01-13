'use strict';

const BadEmail = require('./bad_email_model');

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
