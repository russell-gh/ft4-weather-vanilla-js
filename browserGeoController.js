import { Interface } from "./interface.js";
import { getLocation } from "./location.js";

const _interface = new Interface();

export const browserGetWeather = async () => {
  try {
    const { latitude, longitude } = await getLocation();
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=37b29f091f8754cf8600dea56dee3863`
    );
    _interface.setInterface(data);
  } catch (error) {}
};
