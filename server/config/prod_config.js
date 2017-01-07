const env = process.env,
    MLAB_USER_NAME = env.MLAB_USER_NAME,
    MLAB_PASSWORD = env.MLAB_PASSWORD,
    devConfig = {
    connectionString: `mongodb://${MLAB_USER_NAME}:${MLAB_PASSWORD}@ds157268.mlab.com:57268/planner-prod`,
    googleClient: env.GOOGLE_CLIENT_ID,
    googleSecret: env.GOOGLE_SECRET,
    googleCallbackUrl: env.GOOGLE_AUTH_CALLBACK_URL,
    facebookCallbackUrl: ''
};
module.exports = devConfig;
