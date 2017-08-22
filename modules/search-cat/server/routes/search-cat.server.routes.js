'use strict';

var searchCat = require('../controllers/search-cat.server.controller');

module.exports = function(app) {
  // Routing logic   
  // ...
  app.route('/api/search-cat').get(searchCat.list);
};
