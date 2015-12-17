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

angular
  .module('templateApp')
  .service('tokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper){

  var self = this;

  self.setToken    = setToken;
  self.getToken    = getToken;
  self.decodeToken = decodeToken;
  self.removeToken = removeToken;

  function setToken (token) {
    return $window.localStorage.setItem('auth-token', token);
  }

  function getToken (){
    return $window.localStorage.getItem('auth-token');
  }

  function decodeToken (){
    var token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : {};
  }

  function removeToken (){
    return $window.localStorage.removeItem('auth-token');
  }
}
angular
  .module('templateApp')
  .factory('authInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['API', 'tokenService'];
function AuthInterceptor(API, tokenService) {

  return {
    
    request: function(config){
      var token = tokenService.getToken();

      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },

    response: function(res){
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        tokenService.saveToken(res.data.token);
      }
      return res;
    }

  }
}
angular
  .module('templateApp')
  .service('currentUser', CurrentUser);

CurrentUser.$inject = ['User', 'tokenService']
function CurrentUser(User, tokenService){

  var self  = this;
  self.user = {} 

  self.saveUser = function(user){
    return self.user = user
  }

  self.getUser = function(){
    return self.user;
  }

  self.clearUser = function(){
    return self.user = {};
  }
}
angular
  .module('templateApp')
  .factory('User', User)

User.$inject = ['$resource', 'API']
function User($resource, API){

  return $resource(
    API+'/users/:id', 
    {id: '@id'},
    { 
      'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register': {
        url: API +'/register',
        method: "POST"
      },
      'login':{
        url: API + '/login',
        method: "POST"
      }
    });
}
angular
  .module('templateApp')
  .factory('Chat', Chat)

Chat.$inject = ['$resource', 'API']
function Chat($resource, API){

  return $resource(
    API+'/chats/:id', 
    { id:         '@id'},
    { 'get':    { method: 'GET' },
      'save':   { method: 'POST' },
      'query':  { method: 'GET', isArray: false},
      // 'remove': { method: 'DELETE' },
      // 'delete': { method: 'DELETE' }
    });
}
angular
  .module('templateApp')
  .controller('usersController', UsersController);

UsersController.$inject = ['$resource', 'User', 'tokenService', '$state', 'currentUser'];

function UsersController($resource, User, tokenService, $state, currentUser) {
  
  var self = this;

  self.all          = [];
  self.user         = {};
  self.register     = register;
  self.login        = login;
  self.logout       = logout;
  self.isLoggedIn   = isLoggedIn;
  self.getUsers     = getUsers;

  function register() {
    User.register(self.user, handleLogin);
  }

  function login() {
    User.login(self.user, handleLogin);
  }

  function logout() {
    tokenService.removeToken();
    currentUser.clearUser();
    self.all  = [];
    self.user = {};
  }

  function isLoggedIn() {
    var loggedIn = !!tokenService.getToken();
    return loggedIn;
  }

  function getUsers() {
    User.query(function(data){
     return self.all = data.users;
   });
  }

  function handleLogin(response) {
    var token = response.token ? response.token : null;
    if (token) {
      self.getUsers();
      $state.go('home');
    }
    self.user = tokenService.decodeToken();
    currentUser.saveUser(self.user);
  }

  if (currentUser.getUser()) {
    self.getUsers();
    // self.user = tokenService.decodeToken();
  }

  return self;
}
angular
  .module('templateApp')
  .controller('chatsController', ChatsController);

ChatsController.$inject = ['User', 'Chat', 'currentUser'];

function ChatsController(User, Chat, currentUser) {
  var self  = this;
  
  self.all  = [];
  self.chat = {};
  self.getChats = getChats;
  self.addChat  = addChat;

  function getChats() {
    Chat.query(function(data){
      return self.all = data;
    });
  }

  function addChat() {
    self.chat.created_by   =  currentUser._id;
    self.chat.participants = [currentUser._id];
    var chat = { chat: self.chat }
    Chat.save(chat, function(data){
      self.all.push(data);
      self.chat = {};
    });
  }

  self.getChats();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInRva2VuU2VydmljZS5qcyIsImF1dGhJbnRlcmNlcHRvci5qcyIsImN1cnJlbnRVc2VyLmpzIiwidXNlci5qcyIsImNoYXQuanMiLCJ1c2Vyc0NvbnRyb2xsZXIuanMiLCJjaGF0c0NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYW5ndWxhci1hcHAtY29uY2F0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAubW9kdWxlKCd0ZW1wbGF0ZUFwcCcsIFtcbiAgICAnbmdBcmlhJyxcbiAgICAndWkucm91dGVyJyxcbiAgICAnYW5ndWxhci1qd3QnLFxuICAgICduZ1Jlc291cmNlJ1xuICBdKVxuICAuY29uc3RhbnQoJ0FQSScsICdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpJylcbiAgLmNvbmZpZyhNYWluUm91dGVyKVxuICAuY29uZmlnKGFkZEF1dGhJbnRlcmNlcHRvcik7XG5cbk1haW5Sb3V0ZXIuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG5cbmZ1bmN0aW9uIE1haW5Sb3V0ZXIoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICB1cmw6ICcvJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnZGlzdC9hc3NldHMvdmlld3MvaG9tZS5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdkaXN0L2Fzc2V0cy92aWV3cy9hYm91dC5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgncmVnaXN0ZXInLCB7XG4gICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgdGVtcGxhdGVVcmw6ICdkaXN0L2Fzc2V0cy92aWV3cy9yZWdpc3Rlci5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdkaXN0L2Fzc2V0cy92aWV3cy9sb2dpbi5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgndXNlcnMnLCB7XG4gICAgICB1cmw6ICcvdXNlcnMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdkaXN0L2Fzc2V0cy92aWV3cy91c2Vycy5odG1sJyxcbiAgICB9KVxuICAgIC5zdGF0ZSgnY2hhdHMnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdkaXN0L2Fzc2V0cy92aWV3cy9jaGF0cy5odG1sJyxcbiAgICB9KVxuICAgIC8vIC5zdGF0ZSgnbmV3Y2hhdCcsIHtcbiAgICAvLyAgIHVybDogXCIvbmV3Y2hhdFwiLFxuICAgIC8vICAgdGVtcGxhdGVVcmw6IFwiZGlzdC9hc3NldHMvdmlld3MvbmV3Y2hhdC5odG1sXCJcbiAgICAvLyB9KTtcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufVxuXG5hZGRBdXRoSW50ZXJjZXB0b3IuJGluamVjdCA9IFsnJGh0dHBQcm92aWRlciddO1xuXG5mdW5jdGlvbiBhZGRBdXRoSW50ZXJjZXB0b3IoJGh0dHBQcm92aWRlcil7XG4gICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xufSAgXG4iLCJhbmd1bGFyXG4gIC5tb2R1bGUoJ3RlbXBsYXRlQXBwJylcbiAgLnNlcnZpY2UoJ3Rva2VuU2VydmljZScsIFRva2VuU2VydmljZSk7XG5cblRva2VuU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93JywgJ2p3dEhlbHBlciddO1xuZnVuY3Rpb24gVG9rZW5TZXJ2aWNlKCR3aW5kb3csIGp3dEhlbHBlcil7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYuc2V0VG9rZW4gICAgPSBzZXRUb2tlbjtcbiAgc2VsZi5nZXRUb2tlbiAgICA9IGdldFRva2VuO1xuICBzZWxmLmRlY29kZVRva2VuID0gZGVjb2RlVG9rZW47XG4gIHNlbGYucmVtb3ZlVG9rZW4gPSByZW1vdmVUb2tlbjtcblxuICBmdW5jdGlvbiBzZXRUb2tlbiAodG9rZW4pIHtcbiAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXV0aC10b2tlbicsIHRva2VuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRva2VuICgpe1xuICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoLXRva2VuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGVUb2tlbiAoKXtcbiAgICB2YXIgdG9rZW4gPSBzZWxmLmdldFRva2VuKCk7XG4gICAgcmV0dXJuIHRva2VuID8gand0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKSA6IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlVG9rZW4gKCl7XG4gICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2F1dGgtdG9rZW4nKTtcbiAgfVxufSIsImFuZ3VsYXJcbiAgLm1vZHVsZSgndGVtcGxhdGVBcHAnKVxuICAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgQXV0aEludGVyY2VwdG9yKTtcblxuQXV0aEludGVyY2VwdG9yLiRpbmplY3QgPSBbJ0FQSScsICd0b2tlblNlcnZpY2UnXTtcbmZ1bmN0aW9uIEF1dGhJbnRlcmNlcHRvcihBUEksIHRva2VuU2VydmljZSkge1xuXG4gIHJldHVybiB7XG4gICAgXG4gICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKXtcbiAgICAgIHZhciB0b2tlbiA9IHRva2VuU2VydmljZS5nZXRUb2tlbigpO1xuXG4gICAgICBpZiAoY29uZmlnLnVybC5pbmRleE9mKEFQSSkgPT09IDAgJiYgdG9rZW4pIHtcbiAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9LFxuXG4gICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlcyl7XG4gICAgICBpZiAocmVzLmNvbmZpZy51cmwuaW5kZXhPZihBUEkpID09PSAwICYmIHJlcy5kYXRhLnRva2VuKSB7XG4gICAgICAgIHRva2VuU2VydmljZS5zYXZlVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgfVxufSIsImFuZ3VsYXJcbiAgLm1vZHVsZSgndGVtcGxhdGVBcHAnKVxuICAuc2VydmljZSgnY3VycmVudFVzZXInLCBDdXJyZW50VXNlcik7XG5cbkN1cnJlbnRVc2VyLiRpbmplY3QgPSBbJ1VzZXInLCAndG9rZW5TZXJ2aWNlJ11cbmZ1bmN0aW9uIEN1cnJlbnRVc2VyKFVzZXIsIHRva2VuU2VydmljZSl7XG5cbiAgdmFyIHNlbGYgID0gdGhpcztcbiAgc2VsZi51c2VyID0ge30gXG5cbiAgc2VsZi5zYXZlVXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgIHJldHVybiBzZWxmLnVzZXIgPSB1c2VyXG4gIH1cblxuICBzZWxmLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBzZWxmLnVzZXI7XG4gIH1cblxuICBzZWxmLmNsZWFyVXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHNlbGYudXNlciA9IHt9O1xuICB9XG59IiwiYW5ndWxhclxuICAubW9kdWxlKCd0ZW1wbGF0ZUFwcCcpXG4gIC5mYWN0b3J5KCdVc2VyJywgVXNlcilcblxuVXNlci4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnQVBJJ11cbmZ1bmN0aW9uIFVzZXIoJHJlc291cmNlLCBBUEkpe1xuXG4gIHJldHVybiAkcmVzb3VyY2UoXG4gICAgQVBJKycvdXNlcnMvOmlkJywgXG4gICAge2lkOiAnQGlkJ30sXG4gICAgeyBcbiAgICAgICdnZXQnOiAgICAgICB7IG1ldGhvZDogJ0dFVCcgfSxcbiAgICAgICdzYXZlJzogICAgICB7IG1ldGhvZDogJ1BPU1QnIH0sXG4gICAgICAncXVlcnknOiAgICAgeyBtZXRob2Q6ICdHRVQnLCBpc0FycmF5OiBmYWxzZX0sXG4gICAgICAncmVtb3ZlJzogICAgeyBtZXRob2Q6ICdERUxFVEUnIH0sXG4gICAgICAnZGVsZXRlJzogICAgeyBtZXRob2Q6ICdERUxFVEUnIH0sXG4gICAgICAncmVnaXN0ZXInOiB7XG4gICAgICAgIHVybDogQVBJICsnL3JlZ2lzdGVyJyxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIlxuICAgICAgfSxcbiAgICAgICdsb2dpbic6e1xuICAgICAgICB1cmw6IEFQSSArICcvbG9naW4nLFxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiXG4gICAgICB9XG4gICAgfSk7XG59IiwiYW5ndWxhclxuICAubW9kdWxlKCd0ZW1wbGF0ZUFwcCcpXG4gIC5mYWN0b3J5KCdDaGF0JywgQ2hhdClcblxuQ2hhdC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnQVBJJ11cbmZ1bmN0aW9uIENoYXQoJHJlc291cmNlLCBBUEkpe1xuXG4gIHJldHVybiAkcmVzb3VyY2UoXG4gICAgQVBJKycvY2hhdHMvOmlkJywgXG4gICAgeyBpZDogICAgICAgICAnQGlkJ30sXG4gICAgeyAnZ2V0JzogICAgeyBtZXRob2Q6ICdHRVQnIH0sXG4gICAgICAnc2F2ZSc6ICAgeyBtZXRob2Q6ICdQT1NUJyB9LFxuICAgICAgJ3F1ZXJ5JzogIHsgbWV0aG9kOiAnR0VUJywgaXNBcnJheTogZmFsc2V9LFxuICAgICAgLy8gJ3JlbW92ZSc6IHsgbWV0aG9kOiAnREVMRVRFJyB9LFxuICAgICAgLy8gJ2RlbGV0ZSc6IHsgbWV0aG9kOiAnREVMRVRFJyB9XG4gICAgfSk7XG59IiwiYW5ndWxhclxuICAubW9kdWxlKCd0ZW1wbGF0ZUFwcCcpXG4gIC5jb250cm9sbGVyKCd1c2Vyc0NvbnRyb2xsZXInLCBVc2Vyc0NvbnRyb2xsZXIpO1xuXG5Vc2Vyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ1VzZXInLCAndG9rZW5TZXJ2aWNlJywgJyRzdGF0ZScsICdjdXJyZW50VXNlciddO1xuXG5mdW5jdGlvbiBVc2Vyc0NvbnRyb2xsZXIoJHJlc291cmNlLCBVc2VyLCB0b2tlblNlcnZpY2UsICRzdGF0ZSwgY3VycmVudFVzZXIpIHtcbiAgXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmFsbCAgICAgICAgICA9IFtdO1xuICBzZWxmLnVzZXIgICAgICAgICA9IHt9O1xuICBzZWxmLnJlZ2lzdGVyICAgICA9IHJlZ2lzdGVyO1xuICBzZWxmLmxvZ2luICAgICAgICA9IGxvZ2luO1xuICBzZWxmLmxvZ291dCAgICAgICA9IGxvZ291dDtcbiAgc2VsZi5pc0xvZ2dlZEluICAgPSBpc0xvZ2dlZEluO1xuICBzZWxmLmdldFVzZXJzICAgICA9IGdldFVzZXJzO1xuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuICAgIFVzZXIucmVnaXN0ZXIoc2VsZi51c2VyLCBoYW5kbGVMb2dpbik7XG4gIH1cblxuICBmdW5jdGlvbiBsb2dpbigpIHtcbiAgICBVc2VyLmxvZ2luKHNlbGYudXNlciwgaGFuZGxlTG9naW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgIHRva2VuU2VydmljZS5yZW1vdmVUb2tlbigpO1xuICAgIGN1cnJlbnRVc2VyLmNsZWFyVXNlcigpO1xuICAgIHNlbGYuYWxsICA9IFtdO1xuICAgIHNlbGYudXNlciA9IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gaXNMb2dnZWRJbigpIHtcbiAgICB2YXIgbG9nZ2VkSW4gPSAhIXRva2VuU2VydmljZS5nZXRUb2tlbigpO1xuICAgIHJldHVybiBsb2dnZWRJbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFVzZXJzKCkge1xuICAgIFVzZXIucXVlcnkoZnVuY3Rpb24oZGF0YSl7XG4gICAgIHJldHVybiBzZWxmLmFsbCA9IGRhdGEudXNlcnM7XG4gICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKHJlc3BvbnNlKSB7XG4gICAgdmFyIHRva2VuID0gcmVzcG9uc2UudG9rZW4gPyByZXNwb25zZS50b2tlbiA6IG51bGw7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBzZWxmLmdldFVzZXJzKCk7XG4gICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICB9XG4gICAgc2VsZi51c2VyID0gdG9rZW5TZXJ2aWNlLmRlY29kZVRva2VuKCk7XG4gICAgY3VycmVudFVzZXIuc2F2ZVVzZXIoc2VsZi51c2VyKTtcbiAgfVxuXG4gIGlmIChjdXJyZW50VXNlci5nZXRVc2VyKCkpIHtcbiAgICBzZWxmLmdldFVzZXJzKCk7XG4gICAgLy8gc2VsZi51c2VyID0gdG9rZW5TZXJ2aWNlLmRlY29kZVRva2VuKCk7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn0iLCJhbmd1bGFyXG4gIC5tb2R1bGUoJ3RlbXBsYXRlQXBwJylcbiAgLmNvbnRyb2xsZXIoJ2NoYXRzQ29udHJvbGxlcicsIENoYXRzQ29udHJvbGxlcik7XG5cbkNoYXRzQ29udHJvbGxlci4kaW5qZWN0ID0gWydVc2VyJywgJ0NoYXQnLCAnY3VycmVudFVzZXInXTtcblxuZnVuY3Rpb24gQ2hhdHNDb250cm9sbGVyKFVzZXIsIENoYXQsIGN1cnJlbnRVc2VyKSB7XG4gIHZhciBzZWxmICA9IHRoaXM7XG4gIFxuICBzZWxmLmFsbCAgPSBbXTtcbiAgc2VsZi5jaGF0ID0ge307XG4gIHNlbGYuZ2V0Q2hhdHMgPSBnZXRDaGF0cztcbiAgc2VsZi5hZGRDaGF0ICA9IGFkZENoYXQ7XG5cbiAgZnVuY3Rpb24gZ2V0Q2hhdHMoKSB7XG4gICAgQ2hhdC5xdWVyeShmdW5jdGlvbihkYXRhKXtcbiAgICAgIHJldHVybiBzZWxmLmFsbCA9IGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRDaGF0KCkge1xuICAgIHNlbGYuY2hhdC5jcmVhdGVkX2J5ICAgPSAgY3VycmVudFVzZXIuX2lkO1xuICAgIHNlbGYuY2hhdC5wYXJ0aWNpcGFudHMgPSBbY3VycmVudFVzZXIuX2lkXTtcbiAgICB2YXIgY2hhdCA9IHsgY2hhdDogc2VsZi5jaGF0IH1cbiAgICBDaGF0LnNhdmUoY2hhdCwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICBzZWxmLmFsbC5wdXNoKGRhdGEpO1xuICAgICAgc2VsZi5jaGF0ID0ge307XG4gICAgfSk7XG4gIH1cblxuICBzZWxmLmdldENoYXRzKCk7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
