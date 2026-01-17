// services/alertEngine.js
const { monitored } = require("./alertConfig");

function isEmergency(alert) {
  // You can tune these rules; keep it simple for science fair
  const match = monitored.find(m => m.match?.event === alert.event);
  if (!match) return false;

  // Optional extra filtering
  if (alert.urgency && alert.urgency === "Future") return false;

  return true;
}

function findSoundForAlert(alert) {
  const match = monitored.find(m => m.match?.event === alert.event);
  return match?.wav ?? null;
}

function buildSyntheticAlert(key) {
  const match = monitored.find(m => m.key === key);
  if (!match) return null;

  // Create a payload that looks like the real NWS-mapped alert your UI expects
  return {
    id: `TEST-${key}-${Date.now()}`,
    event: match.label,
    severity: "Severe",
    urgency: "Immediate",
    headline: `[TEST] ${match.label} triggered from touchscreen`,
    isTest: true
  };
}

module.exports = { isEmergency, findSoundForAlert, buildSyntheticAlert };
