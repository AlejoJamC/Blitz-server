const assert = require('assert');
const app = require('../../src/app');

describe('\'murmurs\' service', () => {
  it('registered the service', () => {
    const service = app.service('murmurs');

    assert.ok(service, 'Registered the service');
  });
});
