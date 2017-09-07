(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http', 'Socket', 'Authentication', '$state', '$window', '$location'];

  function ItemsController($scope, $stateParams, $http, Socket, Authentication, $state, $window, $location) {
    var vm = this;

    // Items controller logic
    // ...

    var count = 0;

    var windowElement = angular.element($window);
    windowElement.on('beforeunload', function() {
      console.log('Lol');
      Socket.emit('destroyConn');
    });

    init();

    function init() {
      var data = {};
      data.id = $stateParams.itemId;

      var query = { id: $stateParams.itemId };

      $http.get('/api/search-item', { params: query })
        .success(function(res) {
          $scope.item = res;
          // Make sure the Socket is connected
          if (!Socket.socket) {
            Socket.connect();
          }

          // Add an event listener to the 'chatMessage' event
          Socket.on($stateParams.itemId, function (arg) {
            // console.log(JSON.parse(arg));
            $scope.itemData = JSON.parse(arg);
            count++;
            console.log('received:' + count);
          });

          Socket.on('disconnect', function() {
            console.log('Socket Closed:');
            console.log(Socket);

            sendRequest({
              itemId: $stateParams.itemId
            });
          }); 

          sendRequest({
            itemId: $stateParams.itemId
          });

          $scope.$on('$locationChangeStart', function(event) {
            console.log('Hi');
            if ($location.$$url !== '/items/' + $stateParams.itemId) {
              // Socket.emit('debugEvent', $location.$$url);
              Socket.emit('destroyConn');
            }
          });

          // Remove the event listener when the controller instance is destroyed
          $scope.$on('$destroy', function () {
            Socket.emit('destroyConn');
            Socket.removeListener($stateParams.itemId);
          });
        })
        .error(function(err) {
          console.log('err');
        });
      // $http.get('/api/items/item', { params: data })
      //   .success(function(res) {
      //     console.log(res);
      //   })
      //   .error(function(err) {console.log(err);});

      if (!Authentication.user) {
        $state.go('authentication.signin');
      }
    }

    function sendRequest(arg) {
      Socket.emit('loadData', arg);
    }
  }
})();
