(function () {
  'use strict';

  angular
    .module('talks')
    .controller('TalksListController', TalksListController);

  TalksListController.$inject = ['TalksService'];

  function TalksListController(TalksService) {
    var vm = this;

    vm.talks = TalksService.query();
  }
}());
