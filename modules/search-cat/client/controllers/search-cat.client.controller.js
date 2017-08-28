(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('SearchCatController', SearchCatController);

  SearchCatController.$inject = ['$scope', '$http'];

  function SearchCatController($scope, $http) {
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

    init();

    function init() {
    }
  }
})();
