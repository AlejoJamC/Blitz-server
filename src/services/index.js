const users = require('./users/users.service.js');
const murmurs = require('./murmurs/murmurs.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(murmurs);
};
