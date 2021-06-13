require("dotenv").config();

const { app } = require("deta");

const fetch = require("node-fetch");

const icons = require("./icons.json");

const Oauth1Helper = require("./oauth");

async function main() {
  try {
    const openWeatherUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=:lat&lon=:lon&exclude=minutely,hourly,daily,alerts&appid=:apiKey";

    const twitterUrl =
      "https://api.twitter.com/1.1/account/update_profile.json?name=:name";

    const url = openWeatherUrl
      .replace(":lat", process.env.LATITUDE)
      .replace(":lon", process.env.LOGITUDE)
      .replace(":apiKey", process.env.OPEN_WEATHER_API_KEY);

    const response = await fetch(url);
    const value = await response.json();
    const { icon: type } = value.current.weather[0];

    // send request to twitter
    const request = {
      url: twitterUrl.replace(":name", encodeURI(icons[type])),
      method: "POST",
    };

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);

    await fetch(request.url, {
      method: request.method,
      headers: authHeader,
    });

    console.log(`User name is updated. Icon type ${type}: ${icons[type]}`);
  } catch (err) {
    throw new Error(err);
  }
}

(async function () {
  // deta cron specific code
  if (process.env.DETA_RUNTIME) {
    app.lib.cron(async () => {
      await main();
      return "Cron ran successfully";
    });
  } else {
    await main();
    console.log("Program ran successfully");
  }
})();

module.exports = app;
