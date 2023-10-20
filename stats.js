export class WeatherStats {
  constructor(list) {
    this.list = list;
  }

  get maxTempItem() {
    this.list.sort((item1, item2) => {
      if (item1.main.temp > item2.main.temp) {
        return -1;
      }
      if (item1.main.temp < item2.main.temp) {
        return 1;
      }
      return 0;
    });

    return this.list[0];
  }

  get minTempItem() {
    this.list.sort((item1, item2) => {
      if (item1.main.temp > item2.main.temp) {
        return -1;
      }
      if (item1.main.temp < item2.main.temp) {
        return 1;
      }
      return 0;
    });

    return this.list[this.list.length - 1];
  }

  get maxHumidityItem() {
    this.list.sort((item1, item2) => {
      if (item1.main.humidity > item2.main.humidity) {
        return -1;
      }
      if (item1.main.humidity < item2.main.humidity) {
        return 1;
      }
      return 0;
    });

    return this.list[0];
  }

  get nextDaySunny() {
    return this.list.find((item) => {
      return item.weather[0].main === "Clear"; //sun once implemented TBD
    });
  }

  static feelsLikeDiff(item) {
    return Math.abs(item.main.feels_like - item.main.temp);
  }
}
