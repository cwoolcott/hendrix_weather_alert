// services/nws.js
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

async function getForecast(lat, lon) {
  const points = await fetchJson(`https://api.weather.gov/points/${lat},${lon}`);
  const forecastUrl = points?.properties?.forecast;
  if (!forecastUrl) throw new Error("No forecast URL returned from points endpoint");

  const forecast = await fetchJson(forecastUrl);
  const periods = forecast?.properties?.periods ?? [];
  return periods.slice(0, 6).map(p => ({
    name: p.name,
    temperature: p.temperature,
    temperatureUnit: p.temperatureUnit,
    shortForecast: p.shortForecast,
    windSpeed: p.windSpeed
  }));
}

module.exports = { getForecast };
