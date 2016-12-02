/**
 * Created by brian on 11/29/16.
 */
const dev = require('../../../server/config/dev_config'),
  staging = require('../../../server/config/staging_config'),
  test = require('../../../server/config/test_config'),
  _ = require('lodash'),
  configs = [dev, staging, test];
describe('configFiles', function() {
  it('should have connectionString', function () {
    _.each(configs, function (config) {
      const connectionString = config.connectionString;
      expect(connectionString).toEqual(jasmine.any(String));
      expect(connectionString).toBeTruthy();
    });
  });
});

