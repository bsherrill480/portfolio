const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    widgetSchema = new Schema({
            _page: {type: Schema.Types.ObjectId, ref: 'Page'},
            widgetType: {
                type: String,
                enum: ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT', 'TEXT'],
                required: true
            },
            name: String,
            text: String,
            placeholder: String,
            description: String,
            url: String,
            width: String,
            height: String,
            rows: Number,
            size: Number,
            class: String,
            icon: String,
            deletable: Boolean,
            formatted: Boolean,
            order: Number
    }, {
            timestamps: true
    });

module.exports = widgetSchema;
