import { Interface } from "./interface.js";
import { getLocation } from "./location.js";
import { OWM_API_KEY, OWM_API_URL } from "./config.js";
import { normalizeData } from "./timeUtil.js";

const _interface = new Interface();

export const browserGetWeather = async () => {
  try {
    const { latitude, longitude } = await getLocation();
    const { data } = await axios.get(
      `${OWM_API_URL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OWM_API_KEY}`
    );

    normalizeData(data);
    _interface.setInterface(data);
  } catch (error) {}
};
