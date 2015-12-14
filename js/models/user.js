(function() {
  'use strict';

  User.$inject = ['$resource', 'API'];
  function User($resource, API) {

    return $resource(
      API+'/users/:id',
      {id: '@id'},
      { 'get':       { method: 'GET' },
        'save':      { method: 'POST' },
        'query':     { method: 'GET', isArray: true},
        'remove':    { method: 'DELETE' },
        'delete':    { method: 'DELETE' },
        'authorize': {
          url: API + '/authorize',
          method: "POST"
        },
        'join': {
          url: API + '/join',
          method: "POST"
        }
      }
    );
  }

  module.exports = angular.module('templateApp').factory('User', User);
})();
