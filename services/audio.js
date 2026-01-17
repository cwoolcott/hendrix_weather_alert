// services/audio.js
const { spawn } = require("child_process");
const path = require("path");

let playing = false;

function playSiren() {
  if (playing) return;
  playing = true;

  const soundFile = path.join(__dirname, "..", "sounds", "eas-alarm.wav");

  const player =
    process.platform === "darwin"
      ? spawn("afplay", [soundFile])        // macOS
      : spawn("aplay", [soundFile]);        // Raspberry Pi / Linux

  player.on("exit", () => {
    playing = false;
  });

  player.on("error", () => {
    playing = false;
  });
}

module.exports = { playSiren };
