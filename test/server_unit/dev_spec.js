/**
 * Created by brian on 11/29/16.
 */
const dev = require('../../test-tmp/config/dev');
describe('a test', function () {
  it('should have some value', function () {
    expect(dev.something).toBe('isHere')
  });
});

