(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http', 'Socket', 'Authentication', '$state', '$window'];

  function ItemsController($scope, $stateParams, $http, Socket, Authentication, $state, $window) {
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

      if (!Authentication.user) {
        $state.go('authentication.signin');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      var eventName = $stateParams.itemId + ':' + Authentication.user.username;

      // Add an event listener to the 'chatMessage' event
      Socket.on(eventName, function (arg) {
        console.log(JSON.parse(arg));
      });

      Socket.on('SocketClosed', function() {
        console.log('Socket Closed');
      }); 

      sendRequest({
        // username: Authentication.user.username,
        itemId: $stateParams.itemId
      });

      var windowElement = angular.element($window);
      windowElement.on('beforeunload', function() {
        console.log('Lol');
        Socket.emit('destroyConn', Authentication.user.username);
      });

      $scope.$on('$locationChangeStart', function(event) {
        console.log('Hi');
        Socket.emit('destroyConn', Authentication.user.username);
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.emit('destroyConn', Authentication.user.username);
        Socket.removeListener(eventName);
      });
    }

    function sendRequest(arg) {
      Socket.emit('loadData', arg);
    }
  }
})();
