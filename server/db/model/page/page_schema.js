const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    pageSchema = new Schema({
        _user: {type: Schema.Types.ObjectId, ref: 'User'},
        title: String
    }, {
        timestamps: true
    });

module.exports = pageSchema;
