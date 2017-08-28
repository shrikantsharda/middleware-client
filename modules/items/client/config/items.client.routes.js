(function () {
  'use strict';

  //Setting up route
  angular
    .module('items')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Items state routing
    $stateProvider
      .state('items', {
        url: '/items/',
        templateUrl: 'modules/items/client/views/items.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm'
      })
      .state('item', {
        url: '/items/:itemId',
        templateUrl: 'modules/items/client/views/item.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm'
      });
  }
})();
