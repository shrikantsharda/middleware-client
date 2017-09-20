(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('SearchCatController', SearchCatController);

  SearchCatController.$inject = ['$scope', '$http', '$state'];

  function SearchCatController($scope, $http, $state) {
    var vm = this;

    // $scope.searchCatalogue = function(queryParam, paramVal) {
    //   var query = {};
    //   query[queryParam] = paramVal;
    //   $http.get('/api/search-cat', { params: query })
    //     .success(function(res) {
    //       console.log(res);
    //       $scope.loading = false;
    //       $scope.items = res.items;
    //     })
    //     .error(function(err) {console.log(err);});
    // };

    function getTags() {
      $http.get('/api/search-cat/tags')
        .success(function(res) {
          var spinner = document.getElementById('spinnerDiv');
          if (spinner) {
            spinner.remove();
          }
          $scope.itemTags = res;
          console.log($scope.itemTags);
        })
        .error(function(err) {console.log(err);});
    }

    init();

    $scope.loading = true;

    getTags();

    function init() {
    }
  }
})();
