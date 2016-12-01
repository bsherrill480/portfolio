const websiteSchema = require('./wesbite_schema'),
    mongoose = require('mongoose'),
    Website = mongoose.model('Website', websiteSchema);

//all functions return promises
module.exports = {
    createWebsiteForUser(userId, sentWebsite) {
        const website = new Website(sentWebsite);
        website._user = userId;
        return website.save();
    },

    findAllWebsitesForUser(userId) {
        return Website.find({_user: userId});
    },

    findWebsiteById(websiteId) {
        return Website.findById(websiteId).exec();
    },

    updateWebsite(websiteId, user) {
        return Website.findByIdAndUpdate(websiteId, user).exec();
    },

    deleteWebsite(websiteId) {
        return Website.findByIdAndRemove(websiteId).exec();
    }
};
