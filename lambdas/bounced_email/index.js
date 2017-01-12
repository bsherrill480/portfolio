'use strict';

console.log('Loading function');
const dbInit = require('./server/db/initialize'),
    mongoose = require('mongoose');



exports.handler = function (event, context, callback) {
    'use strict';
    mongoose.connection.on('open', function () {
        console.log('got event', event);
        console.log('got context', context);
        callback('done');
    });
    dbInit();
    //console.log('Received event:', JSON.stringify(event, null, 2));
    // console.log('value1 =', event.key1);
    // console.log('value2 =', event.key2);
    // console.log('value3 =', event.key3);
    // callback(null, event.key1);  // Echo back the first key value
    //callback('Something went wrong');
};
