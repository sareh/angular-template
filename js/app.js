angular
  .module('templateApp', [
    'ngAria',
    'ui.router',
    'angular-jwt',
    'ngResource'
  ])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(addAuthInterceptor);

MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

function MainRouter($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
    })
    .state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
    })
    .state('users', {
      url: '/users',
      templateUrl: 'views/users.html',
    })
    .state('chats', {
      url: '/chats',
      templateUrl: 'views/chats.html',
    })
    // .state('newchat', {
    //   url: "/newchat",
    //   templateUrl: "newchat.html"
    // });
  $urlRouterProvider.otherwise('/');
}

addAuthInterceptor.$inject = ['$httpProvider'];

function addAuthInterceptor($httpProvider){
  $httpProvider.interceptors.push('authInterceptor');
}  
