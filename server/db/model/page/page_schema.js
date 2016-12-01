const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    pageSchema = new Schema({
        _website: {type: Schema.Types.ObjectId, ref: 'Website'},
        name: String,
        title: String, 
        widgets: [{type: Schema.Types.ObjectId, ref: 'Widgets'}],
    }, {
        timestamps: true
    });

module.exports = pageSchema;
