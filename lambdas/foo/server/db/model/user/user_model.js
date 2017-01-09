const userSchema = require('./user_schema'),
    mongoose = require('mongoose'),
    User = mongoose.model('User', userSchema);

module.exports = User;
