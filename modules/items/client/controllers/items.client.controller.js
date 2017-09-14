(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http', 'Socket', 'Authentication', '$state', '$window', '$location', '$interval'];

  function ItemsController($scope, $stateParams, $http, Socket, Authentication, $state, $window, $location, $interval) {
    var vm = this;

    // Items controller logic
    // ...

    var count = 0;

    var d3 = $window.d3;

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
            // return Math.round(d * 10) / 10;
            return d3.format('.01f')(d);
          }
        },
        xAxis: {
          tickFormat: function(d) {
            // return Math.round(d * 10) / 10;
            return d3.time.format('%I:%M:%S')(new Date(d));
          }
        },
        // yDomain: [-1,1]
      }
    };

    $scope.data = [{ values: [], key: 'Random Walk' }];

    $scope.run = true;

    // var x = 0;
    // setInterval(function(){
    //   if (!$scope.run) return;
    //   $scope.data[0].values.push({ x: Date.now(), y: Math.random() - 0.5 });
    //   if ($scope.data[0].values.length > 20) $scope.data[0].values.shift();
    //   x++;
      
    //   $scope.$apply(); // update both chart
    // }, 5000); 

    var maximum = document.getElementById('container').clientWidth / 2 || 300;
    $scope.data1 = [[]];
    $scope.labels1 = [];
    $scope.options1 = {
      // animation: {
      //   duration: 0
      // },
      animation: false,
      elements: {
        line: {
          // borderWidth: 0.5,
          tension: 0
        },
        // point: {
        //   radius: 0
        // }
      },
      // legend: {
      //   display: false
      // },
      // scales: {
      //   xAxes: [{
      //     display: false
      //   }],
      //   yAxes: [{
      //     display: false
      //   }],
      //   gridLines: {
      //     display: false
      //   }
      // },
      // tooltips: {
      //   enabled: false
      // }
    };

    // Update the dataset at 25FPS for a smoothly-animating chart
    // $interval(function () {
    //   getLiveChartData();
    // }, 5000);

    // function getLiveChartData () {
    //   if ($scope.data1[0].length) {
    //     $scope.labels1 = $scope.labels1.slice(1);
    //     $scope.data1[0] = $scope.data1[0].slice(1);
    //   }

    //   while ($scope.data1[0].length < 10) {
    //     $scope.labels1.push(d3.time.format('%I:%M:%S')(new Date(Date.now())));
    //     $scope.data1[0].push(Math.round(getRandomValue($scope.data1[0]) * 10) / 10);
    //   }
    // }

    // function getRandomValue (data) {
    //   var l = data.length, previous = l ? data[l - 1] : 50;
    //   var y = previous + Math.random() * 10 - 5;
    //   return y < 0 ? 0 : y > 100 ? 100 : y;
    // }

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

            $scope.data[0].values.push({ x: $scope.itemData.dataSamplingInstant, y: $scope.itemData.caseTemperature });
            if ($scope.data[0].values.length > 10) $scope.data[0].values.shift();

            $scope.labels1.push(d3.time.format('%I:%M:%S')(new Date($scope.itemData.dataSamplingInstant)));
            $scope.data1[0].push($scope.itemData.caseTemperature);
            if ($scope.data1[0].length > 10) {
              $scope.data1[0].shift();
              $scope.labels1.shift();
            }

            $scope.$apply();

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
