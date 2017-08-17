(function () {
  'use strict';

  // Talks controller
  angular
    .module('talks')
    .controller('TalksController', TalksController);

  TalksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'talkResolve'];

  function TalksController ($scope, $state, $window, Authentication, talk) {
    var vm = this;

    vm.authentication = Authentication;
    vm.talk = talk;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Talk
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.talk.$remove($state.go('talks.list'));
      }
    }

    // Save Talk
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.talkForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.talk._id) {
        vm.talk.$update(successCallback, errorCallback);
      } else {
        vm.talk.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('talks.view', {
          talkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
