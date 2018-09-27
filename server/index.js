// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log("client connected.")
  socket.on('send data', (event) => {
    console.log(`received data:${JSON.stringify(event)}`)    
    socket.broadcast.emit('send data',event)
  })
  socket.on('user connected', (event) => {
    console.log(`user connected:${JSON.stringify(event)}`)        
    event.user && socket.broadcast.emit('user connected',event)
  })
  socket.on('user disconnected', (event) => {
    console.log(`user disconnected:${JSON.stringify(event)}`)            
    event.user && socket.broadcast.emit('user disconnected',event)
  })
});
