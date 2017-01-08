const env = process.env,
    MLAB_USER_NAME = env.MLAB_USER_NAME,
    MLAB_PASSWORD = env.MLAB_PASSWORD,
    GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET = env.GOOGLE_SECRET,
    GOOGLE_AUTH_CALLBACK_URL = env.GOOGLE_AUTH_CALLBACK_URL,
    REDIS_HOST = env.REDIS_HOST,
    prodConfig = {
        connectionString: `mongodb://${MLAB_USER_NAME}:${MLAB_PASSWORD}@ds157268.mlab.com:57268/planner-prod`,
        googleClient: GOOGLE_CLIENT_ID,
        googleSecret: GOOGLE_SECRET,
        googleCallbackUrl: GOOGLE_AUTH_CALLBACK_URL,
        facebookCallbackUrl: '',
        redisOptions: {
            host: REDIS_HOST
        }
    };

module.exports = prodConfig;
