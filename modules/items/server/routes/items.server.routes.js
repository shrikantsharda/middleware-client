'use strict';

var items = require('../controllers/items.server.controller');

module.exports = function(app) {
  // Routing logic   
  // ...
  app.route('/api/items/item').get(items.loadData);
};
