(function () {
  'use strict';

  describe('Talks List Controller Tests', function () {
    // Initialize global variables
    var TalksListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TalksService,
      mockTalk;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TalksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TalksService = _TalksService_;

      // create mock article
      mockTalk = new TalksService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Talk Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Talks List controller.
      TalksListController = $controller('TalksListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTalkList;

      beforeEach(function () {
        mockTalkList = [mockTalk, mockTalk];
      });

      it('should send a GET request and return all Talks', inject(function (TalksService) {
        // Set POST response
        $httpBackend.expectGET('api/talks').respond(mockTalkList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.talks.length).toEqual(2);
        expect($scope.vm.talks[0]).toEqual(mockTalk);
        expect($scope.vm.talks[1]).toEqual(mockTalk);

      }));
    });
  });
}());
