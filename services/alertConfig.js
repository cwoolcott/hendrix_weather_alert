// services/alertConfig.js
module.exports = {
  monitored: [
    {
      key: "tornado_warning",
      label: "Tornado Warning",
      wav: "alert_1_ready.wav",
      match: { event: "Tornado Warning" }
    },
    {
      key: "severe_thunderstorm_warning",
      label: "Severe Thunderstorm Warning",
      wav: "alert_2_ready.wav",
      match: { event: "Severe Thunderstorm Warning" }
    },
    {
      key: "flash_flood_warning",
      label: "Flash Flood Warning",
      wav: "alert_3_ready.wav",
      match: { event: "Flash Flood Warning" }
    },
    {
      key: "flood_warning",
      label: "Flood Warning",
      wav: "alert_4_ready.wav",
      match: { event: "Flood Warning" }
    }
  ]
};
