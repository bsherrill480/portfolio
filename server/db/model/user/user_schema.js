const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
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
            facebookEmail: {type: String, unique: true}
        },
        isGoogleUser: {type: Boolean, required: true},
        google: {
            id: String,
            accessToken: String,
            googleEmail: {type: String, unique: true}
        }
    }, {
        timestamps: true
    });

// In real use, we'd want to salt these.
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = userSchema;
