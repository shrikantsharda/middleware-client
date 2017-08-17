(function () {
  'use strict';

  angular
    .module('talks')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Talks',
      state: 'talks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'talks', {
      title: 'List Talks',
      state: 'talks.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'talks', {
      title: 'Create Talk',
      state: 'talks.create',
      roles: ['user']
    });
  }
}());
