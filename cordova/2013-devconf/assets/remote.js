$(function () {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    //var connection = new WebSocket('ws://127.0.0.1:8080');
    var connection = new WebSocket('ws://cordova.lfryc.jit.su');
    window.connection = connection;

    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
    function guid() { return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4(); }

    var uuid = guid();
    var updatingFromServer = false;


    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
        console.log(error);
    };

    
    connection.onopen = function () {
        // connection is opened and ready to use
    };

    Reveal.addEventListener( 'ready', function(e) {
      var indices = Reveal.getIndices();
      var previous = {
        h: indices.h,
        v: indices.v
      };

      Reveal.addEventListener( 'slidechanged', function(e) {

        var message = {
          uuid: uuid,
          previous: previous,
          current: {
            h: e.indexh,
            v: e.indexv
          }
        }

        if (!updatingFromServer) {
          var m = JSON.stringify(message)
          connection.send(m);
        }

        previous = message.current;
      });

      connection.onmessage = function (m) {
        // try to decode json (I assume that each message from server is json)
        try {
            var message = JSON.parse(m.data);
            if (message.uuid != uuid) {
               var indices = Reveal.getIndices();
               if (indices.h == message.previous.h && indices.v == message.previous.v) {
                 updatingFromServer = true;
                 Reveal.slide(message.current.h, message.current.v);
                 updatingFromServer = false;
               }
            }
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
    };

    });
    

});
