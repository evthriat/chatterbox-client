// YOUR CODE HERE:


$(document).ready(function() {
    
  $('#sendMessage').on('click', function(event) {
    var message = {};
    var $messageField = $('#messageField');
    
    message.username = app.username;
    console.log(app.username);
    message.text = $messageField.val();
    message.roomname = app.roomname;
    $messageField.val('');
    app.send(message);
    console.log(`Message:${JSON.stringify(message)}`);
  });
  
    //$.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages').then(console.log);
  class ChatterBox {
    constructor(url = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages') {
      this.url = url;
      this.lastUpdate = 0;
      this.username = window.location.search.match(/\?username=(.*)/)[1];
      console.log(this.username);
    }
    init () {
            //setTimeout for fetch every one second
                //render messages
            
    }
    send (message) {
      var post = $.post(this.url, message).success((...args) => {
        for (var i = 0; i < args.length; i++) {
          console.log(args[i]);
        }
      });
      
      post.error(error => {
        console.log(`Error:${error}`);
      });
            
    }
    fetch () {
//'where={"username":"hank"}
      $.get(this.url, 'order=-updatedAt').then((data) => {
        //console.log(data)
                //debugger
        _(data.results).each((messageData) => {
          //console.log(`data:${Date.parse(messageData.updatedAt)}, last:${this.lastUpdate}`);
          //if (Date.parse(messageData.updatedAt) > this.lastUpdate) {
            this.lastUpdate = Date.parse(messageData.updatedAt);
            var message = {};
            message.text = messageData.text;
            message.username = messageData.username;
            message.roomname = messageData.roomname;
            message.updatedAt = Date.parse(messageData.updatedAt);
            message.createdAt = Date.parse(messageData.createdAt);
            this.renderMessage(message);
          //}
        });
      });
    }
    renderMessage(message) {
      var username = `<div class="username">${message.username}</div>`;
      var text = `<div class='text'>${message.text}</div>`;
      var roomname = `<div class='roomname'>${message.roomname}</div>`;
      var created = `<div class='createdat'>${message.createdAt}</div>`;
      var updated = `<div class='updatedat'>${message.updatedAt}</div>`;
      $('#chats').prepend(`<div class='message'>${username}${text}${roomname}${created}${updated}</div>`);
    }
    clearMessage() {

    }
    renderRoom() {

        
    }
  }
  window.app = new ChatterBox();
  window.app.fetch();
  
  setInterval(window.app.fetch.bind(app), 1000);
  //refactor fetch to have no setTimeout, then use setInterval to call fetch every x seconds
});