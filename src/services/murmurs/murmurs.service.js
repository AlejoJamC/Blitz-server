// Initializes the `murmurs` service on path `/murmurs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/murmurs.model');
const hooks = require('./murmurs.hooks');
const filters = require('./murmurs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'murmurs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/murmurs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('murmurs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
