'use strict';

var Items = require('../controllers/items.server.controller');

module.exports = function(app) {
  // Routing logic   
  // ...
  
  app.route('/api/search-item').get(Items.searchItem);
};
