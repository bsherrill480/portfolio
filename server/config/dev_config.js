const devConfig = {
    connectionString: 'mongodb://localhost/sherrill-brian-webdev-final',
    googleClient: '176316419365-kptpt2gp57tldfu27h2b97o872bnap44.apps.googleusercontent.com',
    googleSecret: 'Xr_5ypwF-dNbcdtEJNQWNl8e',
    googleCallbackUrl: 'http://localhost:5000/api/auth/google/callback',
    facebookCallbackUrl: 'http://localhost:5000/api/auth/facebook/callback',
    redisOptions: {
        //nada, default should be good
    }
};
module.exports = devConfig;
