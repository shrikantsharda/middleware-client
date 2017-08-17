'use strict';

describe('Talks E2E Tests:', function () {
  describe('Test Talks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/talks');
      expect(element.all(by.repeater('talk in talks')).count()).toEqual(0);
    });
  });
});
