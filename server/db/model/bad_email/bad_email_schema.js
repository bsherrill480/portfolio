'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    badEmailSchema = new Schema({
        email: {type: String, required: true, index: true}
    }, {
        timestamps: true
    });

module.exports = badEmailSchema;
