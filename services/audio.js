// services/audio.js
const { spawn } = require("child_process");
const path = require("path");

let currentProcess = null;

function playWav(filename) {
  // Stop anything already playing (optional but nice for testing)
  if (currentProcess) {
    try { currentProcess.kill(); } catch {}
    currentProcess = null;
  }

  const soundFile = path.join(__dirname, "..", "sounds", filename);
  const cmd = process.platform === "darwin" ? "afplay" : "aplay";
  const args = process.platform === "darwin" ? [soundFile] : ["-q", soundFile];

  currentProcess = spawn(cmd, args);

  currentProcess.on("exit", () => {
    currentProcess = null;
  });

  currentProcess.on("error", () => {
    currentProcess = null;
  });
}

module.exports = { playWav };
