'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    reminderConsts = require('./reminder_consts'),
    reminderSchema = new Schema({
        _user: {type: Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date, required: true, index: true},
        _eventGenerator: {type: Schema.Types.ObjectId, ref: 'EventGenerator'},
        type: {type: String, required: true, enum: reminderConsts.ALL_REMINDER_TYPES}
    }, {
        timestamps: true
    });

module.exports = reminderSchema;
