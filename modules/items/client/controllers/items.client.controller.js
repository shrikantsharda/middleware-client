(function() {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$stateParams', '$http', 'Socket', 'Authentication', '$state', '$window', '$location', '$interval', 'NgMap', '$document', '$compile'];

  function ItemsController($scope, $stateParams, $http, Socket, Authentication, $state, $window, $location, $interval, NgMap, $document, $compile) {
    var vm = this;

    // Items controller logic
    // ...

    var count = 0;
    var numOfFields = 0;

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

    // var maximum = document.getElementById('container').clientWidth / 2 || 300;
    $scope.data1 = [[]];
    $scope.labels1 = [];
    $scope.series1 = ['Case Temperature'];
    $scope.options1 = {
      // animation: {
      //   duration: 0
      // },
      responsive: true,
      maintainAspectRatio: false,
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
      legend: {
        display: true
      },
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

    init();

    function init() {
      var data = {};
      data.id = $stateParams.itemId;

      var query = { id: $stateParams.itemId };

      $http.get('/api/search-item', { params: query })
        .success(function(res) {
          $scope.item = res;
          // Make sure the Socket is connected

          NgMap.getMap().then(function(map) {
            $scope.map = map;
          });

          if (!Socket.socket) {
            Socket.connect();
          }

          // Add an event listener to the 'chatMessage' event
          Socket.on($stateParams.itemId, function (arg) {
            // console.log(JSON.parse(arg));
            $scope.itemData = JSON.parse(arg);
            count++;
            console.log('received:' + count);

            var itemData = JSON.parse(arg);
            if (count === 1) {
              // var itemData = JSON.parse(arg);
              createScopeData(itemData);
              loadGraphs(itemData);
            }

            $scope.data[0].values.push({ x: $scope.itemData.dataSamplingInstant, y: $scope.itemData.caseTemperature });
            if ($scope.data[0].values.length > 10) $scope.data[0].values.shift();

            // $scope.labels1.push(d3.time.format('%I:%M:%S')(new Date($scope.itemData.dataSamplingInstant)));
            // $scope.data1[0].push($scope.itemData.caseTemperature);
            // if ($scope.data1[0].length > 10) {
            //   $scope.data1[0].shift();
            //   $scope.labels1.shift();
            // }

            // $scope.$apply();

            insertGraphData(itemData);

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

    function loadGraphs(data) {
      var dataSamplingInstant = data.dataSamplingInstant;
      delete data.dataSamplingInstant;
      var graphDiv = document.getElementById('graphs');
      var keysArr = Object.keys(data);
      var rowDiv;
      for (var i = 0; i < keysArr.length; i++) {
        var key = keysArr[i];
        if (i % 2 === 0) {
          rowDiv = angular.element('<div class="row" style="height:150px"></div>');
          angular.element(graphDiv).append(rowDiv);
        }
        var containerDiv = angular.element('<div id="container' + i + '" class="col-md-6" style="height:100%"></div>');
        angular.element(rowDiv).append(containerDiv);
        var graphEle = angular.element('<canvas width="100%" height="100%" id="hero-bar' + i + '" class="chart chart-line ng-isolate-scope" chart-data="graphData.' + key + '" chart-options="options1" chart-labels="graphLabels.' + key + '" style="display: block" legend="true" chart-series="graphSeries.' + key + '"></canvas>');
        angular.element(containerDiv).append(graphEle);
      }
      $scope.$apply(function() {
        $compile(graphDiv)($scope);
      });
      data.dataSamplingInstant = dataSamplingInstant;
    }

    function createScopeData(data) {
      var dataSamplingInstant = data.dataSamplingInstant;
      delete data.dataSamplingInstant;
      var keysArr = Object.keys(data);
      $scope.graphData = {};
      $scope.graphLabels = {};
      $scope.graphSeries = {};
      for (var i = 0; i < keysArr.length; i++) {
        var key = keysArr[i];
        $scope.graphData[key] = [[]];
        $scope.graphLabels[key] = [];
        var tempArr = [];
        tempArr.push(key);
        $scope.graphSeries[key] = tempArr;
      }
      data.dataSamplingInstant = dataSamplingInstant;
    }

    function insertGraphData(data) {
      var dataSamplingInstant = data.dataSamplingInstant;
      delete data.dataSamplingInstant;
      var keysArr = Object.keys(data);
      for (var i = 0; i < keysArr.length; i++) {
        var key = keysArr[i];
        $scope.graphLabels[key].push(d3.time.format('%I:%M:%S')(new Date(dataSamplingInstant)));
        $scope.graphData[key][0].push(data[key]);

        if ($scope.graphData[key][0].length > 10) {
          $scope.graphData[key][0].shift();
          $scope.graphLabels[key].shift();
        }
      }

      $scope.$apply();

      data.dataSamplingInstant = dataSamplingInstant;
    }
  }
})();
