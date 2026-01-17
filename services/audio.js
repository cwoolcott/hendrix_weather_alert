// services/audio.js
const path = require("path");
const Player = require("node-aplay"); // WAV playback via aplay

let current = null;
let isPlaying = false;

function playSiren() {
  if (isPlaying) return;
  isPlaying = true;

  const file = path.join(__dirname, "..", "sounds", "siren.wav");
  current = new Player(file);

  current.on("complete", () => {
    isPlaying = false;
    current = null;
  });

  current.on("error", () => {
    isPlaying = false;
    current = null;
  });

  current.play();
}

function stopSiren() {
  // node-aplay doesn’t have a universal stop across all setups;
  // easiest approach for science fair: keep siren short and replay if needed.
  // If you want real stop, we can switch to spawning `aplay` as a child_process.
}

module.exports = { playSiren, stopSiren };
