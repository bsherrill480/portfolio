/**
 *
 * Created by brian on 12/1/16.
 */

const envs = require('../../../server/config/envs'),
    getConfig = require('../../../server/config/get_config'),
    devConfig = require('../../../server/config/dev_config'),
    testConfig = require('../../../server/config/test_config'),
    stagingConfig = require('../../../server/config/staging_config');

describe('envs', function () {
    it('has staging and dev', function () {
        expect(getConfig(envs.DEVELOPMENT)).toEqual(devConfig);
        expect(getConfig(envs.STAGING)).toEqual(stagingConfig);
        expect(getConfig(envs.TEST)).toEqual(testConfig);
    });

    it('will throw error for unknown env', function () {
        expect(() => {getConfig('foo')}).toThrow(new Error('Env not found.'))
    })

});
