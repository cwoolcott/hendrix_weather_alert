const { spawn } = require("child_process");
const path = require("path");

function playWav(filename) {
  const soundFile = path.join(__dirname, "..", "sounds", filename);
  console.log("Playing WAV:", soundFile);

 // const p = spawn("aplay", ["-q", "-D", "plughw:2,0", soundFile]);
 // const p = spawn("aplay", ["-q", "-D", "plughw:1,0", soundFile]);
 const p = spawn("aplay", ["-q", "-D", "plughw:0,0", soundFile]);
  p.stdout.on("data", d => console.log("aplay out:", d.toString()));
  p.stderr.on("data", d => console.log("aplay err:", d.toString()));

  p.on("error", err => console.log("aplay spawn error:", err));
  p.on("close", code => console.log("aplay exit code:", code));
}

module.exports = { playWav };
