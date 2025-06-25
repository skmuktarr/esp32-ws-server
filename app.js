const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("index.html", function (err, data) {
      if (err) {
        res.writeHead(500);
        res.end("Error loading HTML");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
});

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received:", message);
    // Forward or handle messages here
  });
});

server.listen(80, () => console.log("Server running on port 80"));
