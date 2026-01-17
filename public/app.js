const socket = io();

document.getElementById("test").addEventListener("click", () => {
  socket.emit("testSiren");
});



socket.on("alertConfig", function (monitored) {
  var el = document.getElementById("testButtons");

  var html = "";
  for (var i = 0; i < monitored.length; i++) {
    var m = monitored[i];
    html +=
      '<button class="testBtn" data-key="' + m.key + '">' +
      'TEST: ' + m.label +
      '</button>';
  }

  el.innerHTML = html;

  var buttons = el.querySelectorAll("button");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function () {
      socket.emit("testAlert", this.dataset.key);
    });
  }
});




socket.on("status", (s) => {
  document.getElementById("status").textContent = s.message;
});

socket.on("forecast", (periods) => {
  const el = document.getElementById("forecast");

  el.innerHTML = periods.map(p => `
    <div class="card">
      <div class="cardHead">
        <img class="wxIcon" src="${p.icon}" alt="${p.shortForecast}" />
        <div class="title">${p.name}</div>
      </div>

      <div class="wxLine">
        <span class="temp">${p.temperature}°${p.temperatureUnit}</span>
        <span class="desc">${p.shortForecast}</span>
      </div>

      <div class="wind">Wind: ${p.windSpeed}</div>
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
