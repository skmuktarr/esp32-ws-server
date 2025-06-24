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

      // Identify ESP32 client
      if (json.type === "esp32") {
        espSocket = ws;
        console.log("✅ ESP32 identified");
        return;
      }

      // Forward browser command to ESP32
      if (espSocket && ws !== espSocket) {
        espSocket.send(JSON.stringify(json));
      }
    } catch {
      console.log("⚠️ Invalid JSON");
    }
  });

  ws.on("close", () => {
    if (ws === espSocket) {
      console.log("❌ ESP32 disconnected");
      espSocket = null;
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
