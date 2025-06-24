const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`🔌 New client connected (${clients.size} total)`);

  // Send connection acknowledgement
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      console.log(`📥 Received: ${message}`);
      
      // Validate message is proper JSON
      const parsed = JSON.parse(message);
      
      // Broadcast to all other clients
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (err) {
      console.error('❌ Error processing message:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ Client disconnected (${clients.size} remaining)`);
  });

  // Heartbeat to check connection status
  const interval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(interval);
      return;
    }
    ws.ping();
  }, 30000);

  ws.on('pong', () => {
    console.log('💓 Received pong from client');
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  wss.clients.forEach(client => {
    client.close(1001, 'Server shutting down');
  });
  server.close(() => {
    process.exit(0);
  });
});
