'use strict';

const BadEmailSchema = require('./bad_email_schema'),
    mongoose = require('mongoose'),
    EventGenerator = mongoose.model('BadEmail', BadEmailSchema);

//all functions return promises
module.exports = EventGenerator;
