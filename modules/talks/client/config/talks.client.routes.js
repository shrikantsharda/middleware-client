(function () {
  'use strict';

  angular
    .module('talks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('talks', {
        abstract: true,
        url: '/talks',
        template: '<ui-view/>'
      })
      .state('talks.list', {
        url: '',
        templateUrl: 'modules/talks/client/views/list-talks.client.view.html',
        controller: 'TalksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Talks List'
        }
      })
      .state('talks.create', {
        url: '/create',
        templateUrl: 'modules/talks/client/views/form-talk.client.view.html',
        controller: 'TalksController',
        controllerAs: 'vm',
        resolve: {
          talkResolve: newTalk
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Talks Create'
        }
      })
      .state('talks.edit', {
        url: '/:talkId/edit',
        templateUrl: 'modules/talks/client/views/form-talk.client.view.html',
        controller: 'TalksController',
        controllerAs: 'vm',
        resolve: {
          talkResolve: getTalk
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Talk {{ talkResolve.name }}'
        }
      })
      .state('talks.view', {
        url: '/:talkId',
        templateUrl: 'modules/talks/client/views/view-talk.client.view.html',
        controller: 'TalksController',
        controllerAs: 'vm',
        resolve: {
          talkResolve: getTalk
        },
        data: {
          pageTitle: 'Talk {{ talkResolve.name }}'
        }
      });
  }

  getTalk.$inject = ['$stateParams', 'TalksService'];

  function getTalk($stateParams, TalksService) {
    return TalksService.get({
      talkId: $stateParams.talkId
    }).$promise;
  }

  newTalk.$inject = ['TalksService'];

  function newTalk(TalksService) {
    return new TalksService();
  }
}());
