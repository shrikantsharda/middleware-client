(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('SearchCatController', SearchCatController);

  SearchCatController.$inject = ['$scope', '$http', '$state'];

  function SearchCatController($scope, $http, $state) {
    var vm = this;

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
