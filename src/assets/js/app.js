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
      templateUrl: 'dist/assets/views/home.html',
    })
    .state('about', {
      url: '/about',
      templateUrl: 'dist/assets/views/about.html',
    })
    .state('register', {
      url: '/register',
      templateUrl: 'dist/assets/views/register.html',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'dist/assets/views/login.html',
    })
    .state('users', {
      url: '/users',
      templateUrl: 'dist/assets/views/users.html',
    })
    .state('chats', {
      url: '/chats',
      templateUrl: 'dist/assets/views/chats.html',
    })
    // .state('newchat', {
    //   url: "/newchat",
    //   templateUrl: "dist/assets/views/newchat.html"
    // });
  $urlRouterProvider.otherwise('/');
}

addAuthInterceptor.$inject = ['$httpProvider'];

function addAuthInterceptor($httpProvider){
  $httpProvider.interceptors.push('authInterceptor');
}  
