const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let espSocket = null;

wss.on("connection", (ws) => {
  console.log("🔌 New WebSocket connection");

  ws.on("message", (message) => {
    console.log("📩", message);
    try {
      const json = JSON.parse(message);
      if (espSocket && ws !== espSocket) {
        espSocket.send(message);
      }
    } catch {
      console.log("⚠️ Not valid JSON");
    }
  });

  ws.on("close", () => {
    if (ws === espSocket) espSocket = null;
  });

  if (!espSocket) {
    espSocket = ws;
    console.log("🧠 ESP32 connected");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
