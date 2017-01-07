const env = process.env,
    MLAB_USER_NAME = env.MLAB_USER_NAME,
    MLAB_PASSWORD = env.MLAB_PASSWORD,
    GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET = env.GOOGLE_SECRET,
    GOOGLE_AUTH_CALLBACK_URL = env.GOOGLE_AUTH_CALLBACK_URL,
    prodConfig = {
    connectionString: `mongodb://${MLAB_USER_NAME}:${MLAB_PASSWORD}@ds157268.mlab.com:57268/planner-prod`,
    googleClient: GOOGLE_CLIENT_ID,
    googleSecret: GOOGLE_SECRET,
    googleCallbackUrl: GOOGLE_AUTH_CALLBACK_URL,
    facebookCallbackUrl: ''
};

if(!MLAB_PASSWORD || !MLAB_PASSWORD || !GOOGLE_CLIENT_ID || !GOOGLE_SECRET || 
    !GOOGLE_AUTH_CALLBACK_URL) {
    console.log('=========');
    console.log('ENV_VAR MISSING');
    console.log(`MLAB_PASSWORD: ${MLAB_PASSWORD} 
    MLAB_PASSWORD: ${MLAB_PASSWORD} 
    GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID} 
    GOOGLE_SECRET: ${GOOGLE_SECRET}
    GOOGLE_AUTH_CALLBACK_URL: ${GOOGLE_AUTH_CALLBACK_URL}`);
    console.log('=========');
}

module.exports = prodConfig;
