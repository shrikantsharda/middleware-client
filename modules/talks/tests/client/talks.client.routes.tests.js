(function () {
  'use strict';

  describe('Talks Route Tests', function () {
    // Initialize global variables
    var $scope,
      TalksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TalksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TalksService = _TalksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('talks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/talks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TalksController,
          mockTalk;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('talks.view');
          $templateCache.put('modules/talks/client/views/view-talk.client.view.html', '');

          // create mock Talk
          mockTalk = new TalksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Talk Name'
          });

          // Initialize Controller
          TalksController = $controller('TalksController as vm', {
            $scope: $scope,
            talkResolve: mockTalk
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:talkId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.talkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            talkId: 1
          })).toEqual('/talks/1');
        }));

        it('should attach an Talk to the controller scope', function () {
          expect($scope.vm.talk._id).toBe(mockTalk._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/talks/client/views/view-talk.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TalksController,
          mockTalk;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('talks.create');
          $templateCache.put('modules/talks/client/views/form-talk.client.view.html', '');

          // create mock Talk
          mockTalk = new TalksService();

          // Initialize Controller
          TalksController = $controller('TalksController as vm', {
            $scope: $scope,
            talkResolve: mockTalk
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.talkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/talks/create');
        }));

        it('should attach an Talk to the controller scope', function () {
          expect($scope.vm.talk._id).toBe(mockTalk._id);
          expect($scope.vm.talk._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/talks/client/views/form-talk.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TalksController,
          mockTalk;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('talks.edit');
          $templateCache.put('modules/talks/client/views/form-talk.client.view.html', '');

          // create mock Talk
          mockTalk = new TalksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Talk Name'
          });

          // Initialize Controller
          TalksController = $controller('TalksController as vm', {
            $scope: $scope,
            talkResolve: mockTalk
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:talkId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.talkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            talkId: 1
          })).toEqual('/talks/1/edit');
        }));

        it('should attach an Talk to the controller scope', function () {
          expect($scope.vm.talk._id).toBe(mockTalk._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/talks/client/views/form-talk.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
