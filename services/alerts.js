// services/alerts.js
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ScienceFairWeatherSiren/1.0 (parent-child-project)",
      "Accept": "application/geo+json"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function getActiveAlerts(lat, lon) {
  const data = await fetchJson(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
  const features = data?.features ?? [];

  const alerts = features.map(f => {
    const p = f.properties || {};
    return {
      id: f.id || p.id || `NWS-${Date.now()}`,
      event: p.event,
      severity: p.severity,
      urgency: p.urgency,
      headline: p.headline
    };
  });

  return { alerts };
}

module.exports = { getActiveAlerts };
