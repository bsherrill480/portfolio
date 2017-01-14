'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userConsts = require('./user_consts'),
    userSchema = new Schema({
        password: {type: String, default: 'someTrueRandomValueGeneratedAtInsert'},
        email: {type: String, unique: true, required: true},
        emailState: {type:String, enum: userConsts.EMAIL_STATES, required: true},
        isFacebookUser: {type: Boolean, required: true},
        facebook: {
            id: String,
            token: String,
            facebookEmail: {type: String}
        },
        isGoogleUser: {type: Boolean, required: true},
        google: {
            id: String,
            accessToken: String,
            refreshToken: String,
            googleEmail: {type: String}
        },
        allowEventEmails: {type: Boolean, required: true}
    }, {
        timestamps: true
    });

module.exports = userSchema;
