'use strict';

var searchCat = require('../controllers/search-cat.server.controller');

module.exports = function(app) {
  // Routing logic   
  // ...
  app.route('/api/search-cat').get(searchCat.list);
  app.route('/api/search-cat/tags').get(searchCat.getTags);
  app.route('/api/search-cat/tag').get(searchCat.searchByTag);
};
