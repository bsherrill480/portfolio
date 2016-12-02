const pageSchema = require('./page_schema'),
    mongoose = require('mongoose'),
    Page = mongoose.model('Page', pageSchema);

//all functions return promises
module.exports = Page;
