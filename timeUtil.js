export const normalizeData = (weather) => {
  weather.list.forEach((element) => {
    element.dt = element.dt * 1000;
  });

  return weather;
};
