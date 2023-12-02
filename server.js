const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Mapping of clients to rooms
const clients = {};
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'create-room') {
      // Create a room and associate the client
      rooms[data.roomName] = rooms[data.roomName] || [];
      rooms[data.roomName].push(ws);

      // Notify the client about successful room creation
      ws.send(JSON.stringify({ type: 'room-created', roomName: data.roomName }));

      // Notify other clients in the room
      rooms[data.roomName].forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify({ type: 'new-peer', peerId: ws._socket.remoteAddress }));
          ws.send(JSON.stringify({ type: 'new-peer', peerId: client._socket.remoteAddress }));
        }
      });
    } else if (data.type === 'join-room') {
      // Join an existing room
      if (rooms[data.roomName]) {
        rooms[data.roomName].push(ws);

        // Notify the client about successful room joining
        ws.send(JSON.stringify({ type: 'room-joined', roomName: data.roomName }));

        // Notify other clients in the room
        rooms[data.roomName].forEach((client) => {
          if (client !== ws) {
            client.send(JSON.stringify({ type: 'new-peer', peerId: ws._socket.remoteAddress }));
            ws.send(JSON.stringify({ type: 'new-peer', peerId: client._socket.remoteAddress }));
          }
        });
      } else {
        // Notify the client that the room doesn't exist
        ws.send(JSON.stringify({ type: 'room-not-found', roomName: data.roomName }));
      }
    }
    // Handle other message types as needed
  });

  ws.on('close', () => {
    // Handle client disconnection and room removal if necessary
  });
});

// Start the server on a specific port
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
