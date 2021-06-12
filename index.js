require("dotenv").config();

const { app } = require("deta");

const fetch = require("node-fetch");

const icons = require("./icons.json");

const Oauth1Helper = require("./oauth");

function main() {
  const openWeatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=:lat&lon=:lon&exclude=minutely,hourly,daily,alerts&appid=:apiKey";

  const twitterUrl =
    "https://api.twitter.com/1.1/account/update_profile.json?name=:name";

  const url = openWeatherUrl
    .replace(":lat", process.env.LATITUDE)
    .replace(":lon", process.env.LOGITUDE)
    .replace(":apiKey", process.env.OPEN_WEATHER_API_KEY);

  fetch(url)
    .then((response) => response.json())
    .then((value) => {
      const { icon: type } = value.current.weather[0];

      // send request to twitter
      const url = twitterUrl.replace(":name", encodeURI(icons[type]));

      const request = {
        url: url,
        method: "POST",
      };

      const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);

      fetch(request.url, {
        method: request.method,
        headers: authHeader,
      })
        .then((response) => response.json())
        .then(() => {
          console.log("User name is updated.");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
}

// Deta cron specific code
if (process.env.DETA_RUNTIME) {
  app.lib.cron(() => {
    main();
    return "Cron ran";
  });
} else {
  main();
}

module.exports = app;
