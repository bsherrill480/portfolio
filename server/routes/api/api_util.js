const _ = require('lodash'),
    internalUserAttributes = ['password', 'facebook'];

module.exports = {

    // ifUndefinedThenDefault(val, defaultVal) {
    //     return _.isUndefined(val) ? defaultVal : val;
    // },
    //
    // ifHasAttrThenIsString(obj, attr) {
    //     let attrVal = obj[attr];
    //     return _.isUndefined(attrVal) || _.isString(attrVal);
    // },
    //
    // set404IfEmpty(res) {
    //     return function (result) {
    //         // null is also considered empty
    //         if(_.isEmpty(result)) {
    //             res.status(404);
    //         }
    //
    //         return result
    //     }
    // },

    queryResponse(res, queryPromise) {
        let queryFailedResponse = this.queryFailedCallback(res);
        queryPromise
            .then(function(result) {
                res.json(result)
            })
            .catch(queryFailedResponse);
    },

    queryFailedCallback(res) {
        return (err) => {console.log('dberr', err); res.status(500).send('Database error');}
    },

    sendResponseCallback: function (res, resArg) {
        return () => res.send(resArg);
    },

    // takes in an object, and returns a new object with all the attributes the public can see
    // e.g. doesn't return password.
    removeInternalUserAttributes(user) {
        _.each(internalUserAttributes, function (attribute) {
            delete user[attribute];
        });
    },

    formatUserResponse(user) {
        _.each(internalUserAttributes, function (attribute) {
            user[attribute] = undefined;
        });
        return user;
    },

    badParamsJsonResponse(res) {
        res.status(400).end();
    }
    // //moved item from start to finish, then sets item.order = index of of item
    // reorderItemInArr(start, end, arr) {
    //     let movedItem,
    //         i,
    //         item;
    //
    //     if (start < end) {
    //         // shift all elements between [start + 1, end] down by 1
    //         // note: loop doesn't assign anything to arr[end]
    //         movedItem = arr[start];
    //         for (i = start + 1; i <= end; i++) {
    //             arr[i - 1] = arr[i];
    //         }
    //         arr[end] = movedItem; // now assign arr[end]
    //     } else if (start > end) {
    //         // shift all elements between [end, start - 1] up by 1
    //         // note: loop doesn't assign anything to arr[end]
    //         // note: loop is traversing end to front
    //         movedItem = arr[start];
    //         for (i = start; i >= end + 1; i--) {
    //             arr[i] = arr[i - 1];
    //         }
    //         arr[end] = movedItem; // now assign arr[end]
    //     }
    //
    //     //set new orders
    //     for(i = 0; i < arr.length; i++) {
    //         item = arr[i];
    //         item.order = i;
    //     }
    // }

};
