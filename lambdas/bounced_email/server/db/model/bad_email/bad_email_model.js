'use strict';

const EventGeneratorSchema = require('./event_generator_schema'),
    mongoose = require('mongoose'),
    EventGenerator = mongoose.model('EventGenerator', EventGeneratorSchema);

//all functions return promises
module.exports = EventGenerator;
