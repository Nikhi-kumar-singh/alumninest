const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Real-time chat logic using Socket.io
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Broadcast messages to everyone in the chat group
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
