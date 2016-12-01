const widgetSchema = require('./widget_schema'),
    mongoose = require('mongoose'),
    Widget = mongoose.model('Widget', widgetSchema);

//all functions return promises
module.exports = {
    createWidget(pageId, sentWidget) {
        const widget = new Widget(sentWidget);
        widget._page = pageId;
        return widget.save();
    },

    findAllWidgetsForPage(pageId) {
        return Widget.find({_page: pageId}).sort('order')
    },

    findWidgetById(widgetId) {
        return Widget.findById(widgetId).exec();
    },

    updateWidget(widgetId, user) {
        return Widget.findByIdAndUpdate(widgetId, user).exec();
    },

    deleteWidget(widgetId) {
        return Widget.findByIdAndRemove(widgetId).exec();
    }
};
