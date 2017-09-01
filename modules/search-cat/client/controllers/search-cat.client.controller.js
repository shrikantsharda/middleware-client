(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('SearchCatController', SearchCatController);

  SearchCatController.$inject = ['$scope', '$http', '$state'];

  function SearchCatController($scope, $http, $state) {
    var vm = this;

    $scope.searchCatalogue = function(queryParam, paramVal) {
      var query = {};
      query[queryParam] = paramVal;
      $http.get('/api/search-cat', { params: query })
        .success(function(res) {
          console.log(res);
          $scope.items = res.items;
        })
        .error(function(err) {console.log(err);});
    };

    $scope.onItemClick = function(item) {
      // searchCatService.clickedItem = item;
      $state.go('item', { itemId: item.href });
    };

    init();

    function init() {
    }
  }
})();
