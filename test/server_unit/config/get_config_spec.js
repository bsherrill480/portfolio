/**
 *
 * Created by brian on 12/1/16.
 */

const envs = require('../../../test_tmp/config/envs'),
  getConfig = require('../../../test_tmp/config/get_config'),
  devConfig = require('../../../test_tmp/config/dev_config'),
  stagingConfig = require('../../../test_tmp/config/staging_config');

describe('envs', function () {
  it('has staging and dev', function () {
    expect(getConfig(envs.DEVELOPMENT)).toEqual(devConfig);
    expect(getConfig(envs.STAGING)).toEqual(stagingConfig);
  });

  it('will throw error for unknown env', function () {
    expect(() => {getConfig('foo')}).toThrow(new Error('Env not found.'))
  })

});
