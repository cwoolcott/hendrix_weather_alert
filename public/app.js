const socket = io();

document.getElementById("test").addEventListener("click", () => {
  socket.emit("testSiren");
});

socket.on("status", (s) => {
  document.getElementById("status").textContent = s.message;
});

socket.on("forecast", (periods) => {
  const el = document.getElementById("forecast");
  el.innerHTML = periods.map(p => `
    <div class="card">
      <div class="title">${p.name}</div>
      <div>${p.temperature}°${p.temperatureUnit} — ${p.shortForecast}</div>
      <div>Wind: ${p.windSpeed}</div>
    </div>
  `).join("");
});

socket.on("alerts", (alerts) => {
  const el = document.getElementById("alerts");
  if (!alerts.length) {
    el.innerHTML = `<div class="ok">No active alerts 🎉</div>`;
    return;
  }
  el.innerHTML = alerts.map(a => `
    <div class="alert">
      <div class="a-title">${a.event} (${a.severity}/${a.urgency})</div>
      <div>${a.headline || ""}</div>
    </div>
  `).join("");
});
