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
      const date = new Date(item.dt * 1000);
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

    //found the hotest day
    console.log(filtered.list[0].main.temp);
    filtered.list.sort((item1, item2) => {
      if (item1.main.temp > item2.main.temp) {
        return -1; //hotest
      }
      if (item1.main.temp < item2.main.temp) {
        return 1;
      }
      return 0;
    });
    console.log("Hotest:", new Date(filtered.list[0].dt * 1000));
    console.log(
      "Coldest:",
      new Date(filtered.list[filtered.list.length - 1].dt * 1000)
    );

    this.root.innerHTML = html.join("");
  };

  createWeatherItem = (item) => {
    return `<div>
              <h1>The weather at ${new Date(
                item.dt * 1000
              ).toLocaleString()} is:
              </h1>
              <p>Temp: ${Math.round(item.main.temp - 271.15)}&deg;</p>
              <p>Humidity: ${Math.round(item.main.humidity)}%</p>
              <p>Description ${item.weather[0].description}</p>
              <img src="http://openweathermap.org/img/wn/${
                item.weather[0].icon
              }.png" alt="${item.weather[0].description}">
            </div>`;
  };
}
