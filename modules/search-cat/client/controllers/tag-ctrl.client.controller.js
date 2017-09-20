(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('TagCtrlController', TagCtrlController);

  TagCtrlController.$inject = ['$scope', '$stateParams', '$http'];

  function TagCtrlController($scope, $stateParams, $http) {
    var vm = this;

    // Tag ctrl controller logic
    // ...

    var showCatEntries = function(tag) {
      var query = {};
      query.tags = tag;
      $http.get('/api/search-cat/tag', { params: query })
        .success(function(res) {
          // console.log(res);
          $scope.items = res.items;
          $scope.$apply();
          var spinner = document.getElementById('spinnerDiv');
          if (spinner) {
            spinner.remove();
          }
        })
        .error(function(err) {console.log(err);});
    };

    init();

    showCatEntries($stateParams.tag);

    function init() {
    }
  }
})();
