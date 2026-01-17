const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { getForecast } = require("./services/nws");
const { getActiveAlerts } = require("./services/alerts");
const { monitored } = require("./services/alertConfig");
const { isEmergency, findSoundForAlert, buildSyntheticAlert } = require("./services/alertEngine");
const { playWav } = require("./services/audio");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log("alertConfig require =", require("./services/alertConfig"));

app.use(express.static("public"));

const LAT = 35.98;
const LON = -87.12;

let cachedForecast = null;

let lastEmergencyIds = new Set();

function emitStatus(message, type = "info") {
  io.emit("status", { type, message });
}

function handleIncomingAlerts(alerts, source = "nws") {
  // Show alerts in UI
  io.emit("alerts", alerts);

  // Determine which emergency alerts should trigger sounds
  const emergencies = alerts.filter(isEmergency);

  // Trigger sound for *new* emergency IDs only (prevents repeating every poll)
  for (const a of emergencies) {
    if (!a.id) continue;
    if (lastEmergencyIds.has(a.id)) continue;

    const wav = findSoundForAlert(a);
    if (wav) {
      playWav(wav);
      emitStatus(`${a.event} triggered (${source})`, "warn");
    }
    lastEmergencyIds.add(a.id);
  }

  // Optional: clear memory when no emergencies exist (so future ones can trigger again)
  if (emergencies.length === 0 && source === "nws") {
    lastEmergencyIds = new Set();
  }
}

async function refreshWeather() {
  try {
    const forecast = await getForecast(LAT, LON);
    cachedForecast = forecast;              // add this
    io.emit("forecast", forecast);
  } catch (e) {
    emitStatus(`Weather error: ${e.message}`, "error");
  }
}

async function refreshAlerts() {
  try {
    const { alerts } = await getActiveAlerts(LAT, LON);
    handleIncomingAlerts(alerts, "nws");
  } catch (e) {
    emitStatus(`Alerts error: ${e.message}`, "error");
  }
}

io.on("connection", (socket) => {
  socket.emit("alertConfig", monitored || []);

  // Send forecast immediately so UI doesn't wait for the next interval
  if (cachedForecast && cachedForecast.length) {
    socket.emit("forecast", cachedForecast);
  } else {
    refreshWeather(); // kick off a fetch for first-time clients
  }

  socket.on("testAlert", (key) => {
    const synthetic = buildSyntheticAlert(key);
    if (!synthetic) return;
    handleIncomingAlerts([synthetic], "test");
  });
});

setInterval(refreshWeather, 60 * 1000);
setInterval(refreshAlerts, 60 * 1000);

refreshWeather();
refreshAlerts();

server.listen(3000, () => console.log("Dashboard running on http://localhost:3000"));
