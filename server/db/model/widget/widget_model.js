const widgetSchema = require('./widget_schema'),
    mongoose = require('mongoose'),
    Widget = mongoose.model('Widget', widgetSchema);

//all functions return promises
module.exports = Widget;
