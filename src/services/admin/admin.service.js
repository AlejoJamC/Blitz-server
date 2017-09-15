// Initializes the `admin` service on path `/admin`
const createService = require('feathers-mongoose');
const createModel = require('../../models/admin.model');
const hooks = require('./admin.hooks');
const filters = require('./admin.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'admin',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/admin', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('admin');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
