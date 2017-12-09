// YOUR CODE HERE:


$(document).ready(function() {
  
  $('#sendMessage').on('click', function(event) {
    var message = {};
    var $messageField = $('#messageField');
    
    message.username = this.username;
    message.text = $messageField.value;
    message.roomname = this.roomname;
    $messageField.val('');
    app.send(message);
  });
  
    //$.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages').then(console.log);
  class ChatterBox {
    constructor(url = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages') {
      this.url = url;
      this.lastUpdate = 0;
      this.username = window.location.search.match(/\?username=(.*)/)[1];
    }
    init () {
            //setTimeout for fetch every one second
                //render messages
            
    }
    send (message) {
      var post = $.post(this.url, message).success(console.log);
      
      post.error(error => {
        console.log(`Error:${error}`);
      });
            
    }
    fetch () {

      setTimeout(() => this.fetch(), 1000);
      $.get(this.url).then((data) => {
                //debugger
        _(data.results).each((messageData) => {
          if (Date.parse(messageData.updatedAt) > this.lastUpdate) {
            this.lastUpdate = Date.parse(messageData.updatedAt);
            console.log(this.lastUpdate);
            var message = {};
            message.text = messageData.text;
            message.username = messageData.username;
            message.roomname = messageData.roomname;
            this.renderMessage(message);
          }
        });
      });
    }
    renderMessage(message) {
      var username = `<div class="username">${message.username}</div>`;
      var text = `<div class='text'>${message.text}</div>`;
      var roomname = `<div class='roomname'>${message.roomname}</div>`;
      $('#chats').append(`<div class='message'>${username}${text}${roomname}</div>`);
    }
    clearMessage() {

    }
    renderRoom() {

        
    }
  }
  window.app = new ChatterBox();
  window.app.fetch();
  //refactor fetch to have no setTimeout, then use setInterval to call fetch every x seconds
});