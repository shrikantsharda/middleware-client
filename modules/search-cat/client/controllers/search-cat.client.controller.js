(function() {
  'use strict';

  angular
    .module('search-cat')
    .controller('SearchCatController', SearchCatController);

  SearchCatController.$inject = ['$scope', '$http'];

  function SearchCatController($scope, $http) {
    var vm = this;
    var catServer = 'https://smartcity.rbccps.org/api/0.1.0/cat';
    // var catServer = 'http://localhost:8001/cat';

    $scope.searchCatalogue = function(queryParam, paramVal) {
      var tempURL = catServer + '?' + queryParam + '=' + paramVal;
      var iFrame = document.getElementById("searchCatIFrame");
      iFrame.src = tempURL;
      iFrame.addEventListener('load', function() {
        // alert(iFrame.style.height);
        iFrame.style.height = '10000px';
      });
      // var req = {
      //   method: 'GET',
      //   url: tempURL,
      //   headers: {
      //     'apikey': 'c70d6aabe879471985c0d06f04b7ae3a',
      //     'Content-Type': 'application/json'
      //   }
      // };
      // $http(req).then(function(response) {
      //   console.log('Hi');
      // });
      // $http.get(tempURL, 
      //   {
      //     "headers": {
      //       "apikey": "c70d6aabe879471985c0d06f04b7ae3a",
      //       "Content-Type": "application/json"
      //     }
      //   }).then(function(response) {
      //     // res.setHeader('Access-Control-Allow-Origin', '*');
      //     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
      //     // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      //     // console.log('response');
      //   });
    };

    var resizeIFrame = function(obj) {
      obj.style.height = obj.contentWindow.document.scrollHeight + 'px';
    };

    init();

    function init() {
    }
  }
})();
