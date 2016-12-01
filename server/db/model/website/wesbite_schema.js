const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    websiteSchema = new Schema({
        _user: {type: Schema.Types.ObjectId, ref: 'User'},
        name: String,
        description: String,
        // pages: [{type: Schema.Types.ObjectId, ref: 'Website'}],
    }, {
        timestamps: true
    });

module.exports = websiteSchema;
