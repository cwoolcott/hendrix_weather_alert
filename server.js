const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { getForecast } = require("./services/nws");
const { getActiveAlerts } = require("./services/alerts");
const { playSiren } = require("./services/audio");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Set your location
const LAT = 35.98;  // Fairview
const LON = -87.12;
let lastEmergencyState = false;

async function refreshWeather() {
  try {
    const forecast = await getForecast(LAT, LON);
    io.emit("forecast", forecast);
  } catch (e) {
    io.emit("status", { type: "error", message: `Weather error: ${e.message}` });
  }
}

async function refreshAlerts() {
  try {
    const { alerts, emergency } = await getActiveAlerts(LAT, LON);
    io.emit("alerts", alerts);

    // Trigger siren only when switching into emergency state
    if (emergency && !lastEmergencyState) {
      playSiren();
      io.emit("status", { type: "warn", message: "EMERGENCY ALERT: siren triggered" });
    }
    lastEmergencyState = emergency;
  } catch (e) {
    io.emit("status", { type: "error", message: `Alerts error: ${e.message}` });
  }
}

io.on("connection", (socket) => {
  socket.on("testSiren", () => playSiren());
});

setInterval(refreshWeather, 5 * 60 * 1000); // every 5 minutes
setInterval(refreshAlerts, 60 * 1000);      // every 60 seconds

refreshWeather();
refreshAlerts();

server.listen(3000, () => console.log("Dashboard running on http://localhost:3000"));
