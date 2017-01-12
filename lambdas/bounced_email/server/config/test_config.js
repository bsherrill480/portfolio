'use strict';

const env = process.env,
    testConfig = {
    connectionString: 'mongodb://localhost/sherrill-brian-webdev-test-final',
    googleClient: '176316419365-kptpt2gp57tldfu27h2b97o872bnap44.apps.googleusercontent.com',
    googleSecret: 'Xr_5ypwF-dNbcdtEJNQWNl8e',
    redisOptions: {

    },
        AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION,
        AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_KEY: env.AWS_SECRET_KEY
};
module.exports = testConfig;
