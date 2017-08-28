(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http'];

  function ItemsController($scope, $stateParams, $http) {
    var vm = this;

    // Items controller logic
    // ...

    init();

    function init() {
      console.log($stateParams.itemId);
      var data = {};
      data.id = $stateParams.itemId;
      $http.get('/api/items/item', { params: data })
        .success(function(res) {
          console.log(res);
        })
        .error(function(err) {console.log(err);});
    }
  }
})();
