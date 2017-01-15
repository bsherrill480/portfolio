'use strict';

const env = process.env,
    stagingConfig = {
        connectionString: 'mongodb://admin:test1234@ds033046.mlab.com:33046/sherrill-brian-webdev',
        googleClient: '176316419365-kptpt2gp57tldfu27h2b97o872bnap44.apps.googleusercontent.com',
        googleSecret: 'Xr_5ypwF-dNbcdtEJNQWNl8e',
        googleCallbackUrl: 'http://custom-env-1.ywdvpkdr75.us-west-2.elasticbeanstalk.com/api/auth/google/callback',
        facebookCallbackUrl: 'http://custom-env-1.ywdvpkdr75.us-west-2.elasticbeanstalk.com/api/auth/facebook/callback',
        redisOptions: {
        
        },
        AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION,
        AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_KEY: env.AWS_SECRET_KEY,
        AWS_BOUNCED_EMAIL_SNS_ARN: env.AWS_BOUNCED_EMAIL_SNS_ARN,
        sendEmail: true
    };
module.exports = stagingConfig;
