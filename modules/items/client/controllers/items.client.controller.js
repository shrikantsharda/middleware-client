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
      Socket.emit('destroyConn', $stateParams.itemId);
    });

    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 180,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function(d){ return d.x; },
        y: function(d){ return d.y; },
        useInteractiveGuideline: true,
        duration: 0,
        yAxis: {
          tickFormat: function(d) {
            return d3.format('.01f')(d);
          }
        },
        yDomain: [-1,1]
      }
    };

    $scope.data = [{ values: [], key: 'Random Walk' }];

    $scope.run = true;

    var x = 0;
    setInterval(function(){
      if (!$scope.run) return;
      $scope.data[0].values.push({ x: x, y: Math.random() - 0.5 });
      if ($scope.data[0].values.length > 20) $scope.data[0].values.shift();
      x++;
      
      $scope.$apply(); // update both chart
    }, 500); 

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

          Socket.emit('ping');

          Socket.on('pong', function() {
            Socket.emit('ping');
          });

          $scope.$on('$locationChangeStart', function(event) {
            console.log('Hi');
            if ($location.$$url !== '/items/' + $stateParams.itemId) {
              // Socket.emit('debugEvent', $location.$$url);
              Socket.emit('destroyConn', $stateParams.itemId);
            }
          });

          // Remove the event listener when the controller instance is destroyed
          $scope.$on('$destroy', function () {
            Socket.emit('destroyConn', $stateParams.itemId);
            // Socket.removeListener($stateParams.itemId);
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
