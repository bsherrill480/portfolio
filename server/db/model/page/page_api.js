const Page = require('./page_model');

//all functions return promises
module.exports = {
    createPage(userId, sentPage) {
        const page = new Page(sentPage);
        page._user = userId;
        return page.save();
    },

    findAllPagesForUser(userId) {
        return Page.find({_user: userId})
    },

    findPageById(pageId) {
        return Page.findById(pageId).exec();
    },

    updatePage(pageId, page) {
        return Page.findByIdAndUpdate(pageId, page, {new: true}).exec();
    },

    deletePage(pageId) {
        return Page.findByIdAndRemove(pageId).exec();
    }
};
