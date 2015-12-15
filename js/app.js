angular
  .module('templateApp', [
    'ngAria',
    'ui.router',
    'angular-jwt',
    'ngResource'
  ])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter);

MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];
  // function MainRouter($httpProvider){
  //   $httpProvider.interceptors.push('authInterceptor');
  // };
  
function MainRouter($stateProvider, $urlRouterProvider){
  $stateProvider
    // .state('home', {
    //   url: '/',
    //   templateUrl: 'home.html'
    // })
    .state('about', {
      url: '/about',
      templateUrl: 'about.html'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.html'
    });
  $urlRouterProvider.otherwise('/');
}
