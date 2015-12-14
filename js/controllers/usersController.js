angular
  .module('templateApp')
  .controller('usersController', UsersController);

UsersController.$inject = ['$resource', 'User'];

function UsersController($resource, User){
  var self = this;
  this.users = User.query();
}
