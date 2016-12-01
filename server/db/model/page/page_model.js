const pageSchema = require('./page_schema'),
    mongoose = require('mongoose'),
    Page = mongoose.model('Page', pageSchema);

//all functions return promises
module.exports = {
    createPage(websiteId, sentPage) {
        const page = new Page(sentPage);
        page._website = websiteId;
        return page.save();
    },

    findAllPagesForWebsite(website) {
        return Page.find({_website: website})
    },

    findPageById(pageId) {
        return Page.findById(pageId).exec();
    },

    updatePage(pageId, user) {
        return Page.findByIdAndUpdate(pageId, user).exec();
    },

    deletePage(pageId) {
        return Page.findByIdAndRemove(pageId).exec();
    }
};
