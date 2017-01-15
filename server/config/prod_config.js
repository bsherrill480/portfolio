'use strict';

const env = process.env,
    MLAB_USER_NAME = env.MLAB_USER_NAME,
    MLAB_PASSWORD = env.MLAB_PASSWORD,
    prodConfig = {
        connectionString: `mongodb://${MLAB_USER_NAME}:${MLAB_PASSWORD}@ds157268.mlab.com:57268/planner-prod`,
        googleClient: env.GOOGLE_CLIENT_ID,
        googleSecret: env.GOOGLE_SECRET,
        googleCallbackUrl: env.GOOGLE_AUTH_CALLBACK_URL,
        facebookCallbackUrl: '',
        redisOptions: {
            host: env.REDIS_HOST
        },
        AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION,
        AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_KEY: env.AWS_SECRET_KEY,
        AWS_BOUNCED_EMAIL_SNS_ARN: env.AWS_BOUNCED_EMAIL_SNS_ARN,
        sendEmail: true
    };

module.exports = prodConfig;
