const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    userUtil = require('./user_util'),
    Schema = mongoose.Schema,
    userSchema = new Schema({
        username: {type: String, default: '', unique: true},
        password: {type: String, default: 'someTrueRandomValueGeneratedAtInsert'},
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        email: {type: String, default: '', unique: true},
        facebook: {
            id: String,
            token: String
        }
    }, {
        timestamps: true
    });

// In real use, we'd want to salt these.
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = userSchema;
