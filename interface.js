import { OWM_URL } from "./config.js";
import { WeatherStats } from "./stats.js";

export class Interface {
  constructor() {
    this.root = document.getElementById("root");
    this.choicesRef = document.getElementById("choices");
  }

  setChoices = (data) => {
    if (data.length) {
      const choicesHTML = data.map((item, index) => {
        const { name = "", state = "", country = "" } = item;
        return `<p id="${index}">${name ? name + "," : ""} ${
          state ? state + "," : ""
        } ${country}</p>`;
      });

      this.choicesRef.innerHTML = choicesHTML.join("");
    }
  };

  getWeatherStartingAt = (weather) => {
    const index = weather.list.findIndex((item) => {
      const date = new Date(item.dt);
      if (date.getHours() === 7) {
        return true;
      }
    });
    weather.list.splice(0, index);

    return weather;
  };

  clearWeather = () => {
    this.root.innerHTML = ``;
  };

  setInterface = (weather) => {
    const filtered = this.getWeatherStartingAt(weather);
    const html = filtered.list.map((item, i) => {
      if (i % 8 !== 0) {
        return;
      }

      return this.createWeatherItem(item);
    });

    //have the weather data
    const _weatherStats = new WeatherStats(weather.list);
    const statsHTML = this.createStats(_weatherStats, weather);

    this.root.innerHTML = statsHTML + html.join(" ");
  };

  createStats = (_weatherStats, weather) => {
    const { humidity } = _weatherStats.maxHumidityItem.main;
    const ws = _weatherStats;

    const maxTemp = new Date(ws.maxTempItem.dt).toLocaleDateString("en-GB");

    const minTemp = new Date(ws.minTempItem.dt).toLocaleDateString("en-GB");

    const maxHumidity = new Date(ws.maxHumidityItem.dt).toLocaleDateString(
      "en-GB"
    );

    const nextDaySunny = ws.nextDaySunny
      ? new Date(ws.nextDaySunny.dt).toDateString()
      : "No SUN!";

    const feelsLikeDiff = Math.round(
      WeatherStats.feelsLikeDiff(weather.list[0])
    );

    return this.createStateHTML(
      minTemp,
      maxTemp,
      maxHumidity,
      nextDaySunny,
      feelsLikeDiff,
      humidity
    );
  };

  createStateHTML(
    minTemp,
    maxTemp,
    maxHumidity,
    nextDaySunny,
    feelsLikeDiff,
    humidity
  ) {
    return `<div class="stats">
                <p>Hottest Day: ${maxTemp}</p>
                <p>Coldest Day: ${minTemp}</p>
                <p>Max Humidity Day: ${maxHumidity} is ${humidity}%</p>
                <p>Next Sunny Day: ${nextDaySunny}</p>
                ${
                  feelsLikeDiff
                    ? `<p>Current feels like diff: ${feelsLikeDiff}&deg;</p>`
                    : ``
                }
            </div>`;
  }

  createWeatherItem = (item) => {
    return `<div>
              <h1>The weather at ${new Date(item.dt).toLocaleString()} is:
              </h1>
              <p>Temp: ${Math.round(item.main.temp - 271.15)}&deg;</p>
              <p>Humidity: ${Math.round(item.main.humidity)}%</p>
              <p>Description ${item.weather[0].description}</p>
              <img src="${OWM_URL}/img/wn/${item.weather[0].icon}.png" alt="${
      item.weather[0].description
    }">
            </div>`;
  };
}
