// Talks service used to communicate Talks REST endpoints
(function () {
  'use strict';

  angular
    .module('talks')
    .factory('TalksService', TalksService);

  TalksService.$inject = ['$resource'];

  function TalksService($resource) {
    return $resource('api/talks/:talkId', {
      talkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
