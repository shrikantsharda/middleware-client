(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http', 'Socket'];

  function ItemsController($scope, $stateParams, $http, Socket) {
    var vm = this;

    // Items controller logic
    // ...

    init();

    function init() {
      var data = {};
      data.id = $stateParams.itemId;
      // $http.get('/api/items/item', { params: data })
      //   .success(function(res) {
      //     console.log(res);
      //   })
      //   .error(function(err) {console.log(err);});

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on($stateParams.itemId, function (arg) {
        console.log(arg);
      });

      sendTest($stateParams.itemId);

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener($stateParams.itemId);
      });
    }

    function sendTest(arg) {
      Socket.emit('testEventSend', arg);
    }
  }
})();
