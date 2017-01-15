'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    reminderSchema = new Schema({
        _user: {type: Schema.Types.ObjectId, ref: 'User'},
        _eventGenerator: {type: Schema.Types.ObjectId, ref: 'EventGenerator'},
        email: {type: String, required: true, index: true}
    }, {
        timestamps: true
    });

module.exports = reminderSchema;
