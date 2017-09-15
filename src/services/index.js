const users = require('./users/users.service.js');
const murmurs = require('./murmurs/murmurs.service.js');
const admin = require('./admin/admin.service.js');
const connections = require('./connections/connections.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(murmurs);
  app.configure(admin);
  app.configure(connections);
};
