const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Serve HTML from public/index.html
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "public", "index.html");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading index.html");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // You can forward it or store it here
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Start server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
