// YOUR CODE HERE:


$(document).ready(function() {
    


  $('#sendMessage').on('click', function(event) {
    var message = {};
    var $messageField = $('#messageField');
    
    message.username = app.username;
    message.text = $messageField.val();
    message.roomname = app.roomName;

    $messageField.val('');
    app.send(message);
  });
  $('#createroom').on('click', function(event) {
    
    var roomName = (prompt('What do you want to call the room?') || 'lobby');
    app.addRoom(roomName);
    app.changeRoom(roomName);
  });
  $('#roomselector').change(function(event) {
    var roomName = $(this).find(':selected').val();
    app.changeRoom(roomName);
  });
    //$.get('http://parse.sfm6.hackreactor.com/chatterbox/classes/messages').then(console.log);
  class ChatterBox {
    constructor(url = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages') {
      this.url = url;
      this.lastUpdate = 0;
      this.username = window.location.search.match(/\?username=(.*)/)[1];
      this.rooms = [];
    }
    init () {
      console.log('here');
      var returnObj = $.get(this.url)
        
        .then((data) => {
          _(data.results).each((messageData) => {
            console.log(`data:${Date.parse(messageData.updatedAt)}, last:${this.lastUpdate}`);
            this.lastUpdate = Date.parse(messageData.updatedAt);
            var message = {};
            message.text = messageData.text;
            message.username = messageData.username;
            message.roomname = messageData.roomname;
            message.updatedAt = Date.parse(messageData.updatedAt);
            

            console.log('Message', message);
          
            if (message.username !== undefined) {

              message.text = message.text === undefined ? '' : message.text;
              message.roomname = message.roomname === undefined ? '' : message.roomname;
              this.renderMessage(message);
              this.addRoom(message.roomname);
            }

          });
        })

        .fail(error => console.log(`Error:${error}`));
    
      this.roomName = 'Welcome';
      this.addRoom(this.roomName);
      this.changeRoom(this.roomName);
    }

    //param: roomname:string
    addRoom (roomname) {
      if (!_(this.rooms).contains(roomname) && roomname.length > 0) {
        this.rooms.push(roomname);

        var roomnameNode = document.createElement('option');  //<div class="username">${message.username}</div>
        roomnameNode.classList.add( 'roomoption');
        roomnameNode.appendChild(document.createTextNode(roomname));

        $('#roomselector').append(roomnameNode);
      }
    }

    changeRoom (roomname) {
      this.roomName = roomname;
      this.renderRoom(this.roomName);
      $('#roomselector').val(this.roomName);
    }
     
    //param: message object with strings
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
            message.text = messageData.text;
            message.username = messageData.username;
            message.roomname = messageData.roomname;
            message.updatedAt = Date.parse(messageData.updatedAt);
            this.renderMessage(message);
            this.addRoom(message.roomname);
          }
        });
      });
    }

    escapeString(string) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(string));  //<div class="username">${message.username}</div>
      return div.innerHTML;
    }

    renderMessage(message) {
      var username = document.createElement('div');  //<div class="username">${message.username}</div>
      username.classList.add('username');
      username.appendChild(document.createTextNode(message.username));

      var roomname = document.createElement('div');  //<div class="username">${message.username}</div>
      roomname.classList.add( 'roomname');
      roomname.appendChild(document.createTextNode(message.roomname));

      var text = document.createElement('div');  //<div class="username">${message.username}</div>
      text.classList.add( 'text');
      text.appendChild(document.createTextNode(message.text));

      var updatedAt = document.createElement('div');  //<div class="username">${message.username}</div>
      updatedAt.classList.add( 'updatedAt');
      updatedAt.appendChild(document.createTextNode(message.updatedAt));


      //console.log(username)
      //var text = `<div class='text'>${message.text}</div>`;

      if (message.roomname === this.roomname) {
        roomname.classList.remove('hide');
      } else {
        roomname.classList.add('hide');
      }
      // var created = `<div class='createdat'>${message.createdAt}</div>`;
      // var updated = `<div class='updatedat'>${message.updatedAt}</div>`;
      // var message = document.createElement('div');
      // message.appendChild(username);
      // message.appendChild(text)

      var messageNode = document.createElement('div');  //<div class="username">${message.username}</div>
      messageNode.classList.add('message');
      messageNode.appendChild(username);
      messageNode.appendChild(text);
      messageNode.appendChild(roomname);
      messageNode.appendChild(updatedAt);



      $('#chats').prepend(messageNode);
      
    }
    clearMessage() {

    }
    renderRoom(roomname) {
      var escapedRoomName = this.escapeString(roomname);
    
      var $roomMessages = $('.message');

      $roomMessages.addClass('hide');
      var $rooms = $roomMessages.filter(function() {
        var $this = $(this);
        var $child = $this.find('.roomname');
        var val = $child.text();
        return (val === escapedRoomName);
      });
      //set visibility to visible
      $rooms.removeClass('hide');
      this.roomName = escapedRoomName;
      $('#roomselector').val(this.roomName);

    }
  }
  window.app = new ChatterBox();
  window.app.init();
  window.app.fetch();
  
  setInterval(window.app.fetch.bind(app), 300);
  //refactor fetch to have no setTimeout, then use setInterval to call fetch every x seconds
});