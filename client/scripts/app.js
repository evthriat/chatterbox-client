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
  $('#createroom').on('click', function(event) {
    
    var roomName = (prompt('What do you want to call the room?') || 'lobby');
    app.addRoom(roomName);
  });
  $('#roomselector').change(function(event) {
    var roomName = $(this).find(':selected').val();
    app.renderRoom(roomName);
  });
    //$.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages').then(console.log);
  class ChatterBox {
    constructor(url = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages') {
      this.url = url;
      this.lastUpdate = 0;
      this.username = window.location.search.match(/\?username=(.*)/)[1];
      this.rooms = ['Lobby'];
      this.roomName = 'Lobby';
      $('#roomselector').val(this.roomName);
    }
    init () {
      $.get(this.url, 'order=updatedAt').then((data) => {
        //console.log(data)
                //debugger
        _(data.results).each((messageData) => {
          //console.log(`data:${Date.parse(messageData.updatedAt)}, last:${this.lastUpdate}`);
          this.lastUpdate = Date.parse(messageData.updatedAt);
          var message = {};
          message.text = escape(messageData.text);
          message.username = escape(messageData.username);
          message.roomname = escape(messageData.roomname);
          message.updatedAt = Date.parse(messageData.updatedAt);
          message.createdAt = Date.parse(messageData.createdAt);
          this.renderMessage(message);
          this.addRoom(message.roomname);

        });
      });
            //setTimeout for fetch every one second
                //render messages
       
    }

    addRoom (roomname) {
      if (!_(this.rooms).contains(roomname) && roomname.length > 0) {
        this.rooms.push(roomname);
        $('#roomselector').append(`<option class="roomoption" value="${roomname}">${roomname}</option>`);
        this.renderRoom(roomname);
      }
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
          if (Date.parse(messageData.updatedAt) > this.lastUpdate) {
            this.lastUpdate = Date.parse(messageData.updatedAt);
            var message = {};
            message.text = escape(messageData.text);
            message.username = escape(messageData.username);
            message.roomname = escape(messageData.roomname);
            this.addRoom(message.roomname);
            message.updatedAt = Date.parse(messageData.updatedAt);
            message.createdAt = Date.parse(messageData.createdAt);
            this.renderMessage(message);
          }
        });
      });
    }
    renderMessage(message) {
      var username = `<div class="username">${message.username}</div>`;
      var text = `<div class='text'>${message.text}</div>`;

      if (message.roomname === this.roomname) {
        var roomname = `<div class='roomname'>${message.roomname}</div>`;
      } else {
        var roomname = `<div class='roomname hide'>${message.roomname}</div>`;
      }
      var created = `<div class='createdat'>${message.createdAt}</div>`;
      var updated = `<div class='updatedat'>${message.updatedAt}</div>`;
      $('#chats').prepend(`<div class='message'>${username}${text}${roomname}${created}${updated}</div>`);
      
    }
    clearMessage() {

    }
    renderRoom(roomname) {
      var $roomMessages = $('.message');

      $roomMessages.addClass('hide');
      var $rooms = $roomMessages.filter(function() {
        var $this = $(this);
        var $child = $this.find('.roomname');
        var val = $child.val();
        return (val === roomname);
      });
      //set visibility to visible 
      this.roomName = roomname;
      $('#roomselector').val(this.roomName);

    }
  }
  window.app = new ChatterBox();
  window.app.init();
  window.app.fetch();
  
  setInterval(window.app.fetch.bind(app), 1000);
  //refactor fetch to have no setTimeout, then use setInterval to call fetch every x seconds
});