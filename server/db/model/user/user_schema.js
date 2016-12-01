const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema,
    userSchema = new Schema({
        username: {type: String, default: '', unique: true},
        password: {type: String, default: 'someTrueRandomValueGeneratedAtInsert'},
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        email: {type: String, default: '', unique: true},
        // phone: {type: String, default: ''},
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

// this is a static method, but we'll attach it to the model to keep it convenient.
userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password);
};

module.exports = userSchema;
