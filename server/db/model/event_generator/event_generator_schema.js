const mongoose = require('mongoose'),
    eventGeneratorConsts = require('./event_generator_consts'),
    Schema = mongoose.Schema,
    eventGeneratorSchema = new Schema({
        _user: {type: Schema.Types.ObjectId, ref: 'User'},
        question: {type: String, required: true},
        date: {type: Date, required: true},
        intervalYear: {type: Number, required: true},
        intervalMonth: {type: Number, required: true},
        intervalDay: {type: Number, required: true},
        generatorType: {type:String, enum: eventGeneratorConsts.EVENT_GENERATOR_TYPES}
    }, {
        timestamps: true
    });

module.exports = eventGeneratorSchema;
