(function() {
  'use strict';

  // Search cat module config
  angular
    .module('search-cat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add topbar menu item
    Menus.addMenuItem('topbar', {
      title: 'Search Catalogue',
      state: 'search-cat',
      type: 'item',
      roles: ['*']
    });
  }
})();
