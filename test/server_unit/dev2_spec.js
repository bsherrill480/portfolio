/**
 * Created by brian on 11/29/16.
 */
const dev = require('../../test_tmp/config/dev');
describe('a test2', function () {
  it('should have some value', function () {
    expect(dev.something).toBe('isHere')
  });
  it('should not have cat', function () {
    expect(dev.cat).toBe(undefined)
  });
});

