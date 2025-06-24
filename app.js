// server.js
const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 10000;

// Create HTTP server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
