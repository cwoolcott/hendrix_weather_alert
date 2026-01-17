// services/alerts.js
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ScienceFairWeatherSiren/1.0 (local project)",
      "Accept": "application/geo+json"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// You can tune this list to your comfort level
const EMERGENCY_EVENTS = new Set([
  "Tornado Warning",
  "Severe Thunderstorm Warning",
  "Flash Flood Warning",
  "Flood Warning"
]);

async function getActiveAlerts(lat, lon) {
  const data = await fetchJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
  const features = data?.features ?? [];

  const alerts = features.map(f => {
    const p = f.properties || {};
    return {
      event: p.event,
      severity: p.severity,
      urgency: p.urgency,
      headline: p.headline
    };
  });

  const emergency = alerts.some(a => EMERGENCY_EVENTS.has(a.event) && a.urgency !== "Future");
  return { alerts, emergency };
}

module.exports = { getActiveAlerts };
