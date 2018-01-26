var socketIO = require('socket.io');
var server = require('http').createServer().listen(7000, '0.0.0.0');
var io = socketIO.listen(server);

connections = [];
usernames = [];

console.log('Server running...');

// var app = require('express')();
// var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

// Super simple server:
//  * One room only. 
//  * We expect two people max. 
//  * No error handling.

io.sockets.on('connection', function (client) {
    console.log('new connection: ' + client.id);
    connections.push(client);
    console.log('Connected: %s sockets connected', connections.length);    
    client.broadcast.emit('usernames', usernames);
    console.log('server broadcasting usernames');

    client.on('sendname', function(name) {
        client.name = name.sendname;
        usernames.push(client.name);
        console.log('new user: ' + name.sendname);
        client.broadcast.emit('usernames', usernames);
        console.log('server broadcasting usernames');
    });

    client.on('offer', function (details) {
        console.log('server received offer from ' + client.id);
        client.broadcast.emit('offer', details);
        console.log('sersver broadcasting offer');
        // console.log('offer: ' + JSON.stringify(details));
    });

    client.on('answer', function (details) {
        console.log('server received answer from ' + client.id);
        client.broadcast.emit('answer', details);
        console.log('sersver broadcasting answer');
        // console.log('answer: ' + JSON.stringify(details));
    });
    
    client.on('candidate', function (details) {
        console.log('server received candidate from ' + client.id);
        client.broadcast.emit('candidate', details);
        // console.log('candidate: ' + JSON.stringify(details));
        console.log('sersver broadcasting candidate');
    });

    client.on('disconnect', function (details) {
        connections.splice(connections.indexOf(client), 1)
        usernames.splice(usernames.indexOf(client), 1)        
        console.log('Disconnected: %s sockets connected', connections.length);
        client.broadcast.emit('usernames', usernames);
        console.log('server broadcasting usernames');
    });

    // Here starts evertyhing!
    // The first connection doesn't send anything (no other clients)
    // Second connection emits the message to start the SDP negotation


    // client.broadcast.emit('createoffer', {});
    // console.log('server broadcasting: createoffer');
});

