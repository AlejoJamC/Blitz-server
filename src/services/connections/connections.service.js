// Initializes the `connections` service on path `/connections`
const createService = require('feathers-mongoose');
const createModel = require('../../models/connections.model');
const hooks = require('./connections.hooks');
const filters = require('./connections.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'connections',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/connections', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('connections');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
