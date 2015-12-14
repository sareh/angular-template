angular
  .module('templateApp', [
    'ngAria',
    'ui.router',
    'angular-jwt',
    'ngResource'
  ])
  .constant('API', 'http://localhost:3000/api')
  .config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
});