// services/alertConfig.js
module.exports = {
  monitored: [
    {
      key: "tornado_warning",
      label: "Tornado Warning",
      wav: "eas-alarm.wav",
      match: { event: "Tornado Warning" }
    },
    {
      key: "severe_thunderstorm_warning",
      label: "Severe Thunderstorm Warning",
      wav: "eas-alarm.wav",
      match: { event: "Severe Thunderstorm Warning" }
    },
    {
      key: "flash_flood_warning",
      label: "Flash Flood Warning",
      wav: "eas-alarm.wav",
      match: { event: "Flash Flood Warning" }
    },
    {
      key: "flood_warning",
      label: "Flood Warning",
      wav: "eas-alarm.wav",
      match: { event: "Flood Warning" }
    }
  ]
};
