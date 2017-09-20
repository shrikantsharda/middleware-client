(function () {
  'use strict';

  //Setting up route
  angular
    .module('search-cat')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Search cat state routing
    $stateProvider
      .state('search-cat', {
        url: '/search-cat',
        templateUrl: 'modules/search-cat/client/views/search-cat.client.view.html',
        controller: 'SearchCatController',
        controllerAs: 'vm'
      })
      .state('tag', {
        url: '/search-cat/:tag',
        templateUrl: 'modules/search-cat/client/views/tag.search-cat.client.view.html',
        controller: 'TagCtrlController',
        controllerAs: 'vm'
      });
  }
})();
