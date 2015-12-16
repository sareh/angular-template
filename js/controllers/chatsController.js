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