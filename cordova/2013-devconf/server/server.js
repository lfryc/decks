var WebSocketServer = require('websocket').server;
var http = require('http');
var sets = require('simplesets');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(8080, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server

var connections = new sets.Set();

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    connections.add(connection);
    console.log('connections: ' + connections.size());

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(m) {
        if (m.type === 'utf8') {
            // process WebSocket message
            try {
              message = JSON.parse(m.utf8Data);
              if (message.uuid && message.previous && message.current) {
                console.log("%j", message);
                var forward = {
                  uuid: message.uuid,
                  previous: message.previous,
                  current: message.current
                };
                connections.each(function(connection) {
                  connection.send(JSON.stringify(forward));
                });
              }
            } catch (e) {
              console.log("%j", e);
            }
        }
    });

    connection.on('close', function(c) {
        // close user connection
        connections.remove(connection);
        console.log('connections: ' + connections.size());
    });
});

console.log('listening on 1337');
