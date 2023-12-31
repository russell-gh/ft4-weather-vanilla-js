import { Interface } from "./interface.js";
import { get, set } from "./storage/sorageUtils.js";
import { OWM_API_KEY, OWM_API_URL } from "./config.js";
import { normalizeData } from "./timeUtil.js";
const locationInputRef = document.getElementById("location");
const errorRef = document.getElementById("error");
const choicesRef = document.getElementById("choices");
const apiErrorRef = document.getElementById("api-error");

let locationInput = "";
let choicesAPIData;

const _interface = new Interface();

window.addEventListener("offline", () => {
  apiErrorRef.innerHTML = `<p>Internet unavailable</p>`;
});
window.addEventListener("online", () => {
  apiErrorRef.innerHTML = ``;
});

export const listenForChoice = () => {
  choicesRef.addEventListener("click", async (e) => {
    //if you clicked outside and item, do nothing
    if (e.target.id === "choices") {
      return;
    }

    //clear the old selections
    choicesRef.innerHTML = ``;

    const { name, state, country, lat, lon } = choicesAPIData[e.target.id];

    //write the selection into the input box
    locationInputRef.value = `${name ? name + ", " : ""}${
      state ? state + ", " : ""
    }${country}`;

    //make api call to the weather people using the long lat above

    // set(locationInput, result);
    try {
      const weather = await axios.get(
        `${OWM_API_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`
      );

      normalizeData(weather.data);

      //task to the setInterface stuff and it can sort the interface
      _interface.setInterface(weather.data);
    } catch (e) {
      apiErrorRef.innerHTML = `<p>API down, please try later</p>`;
    }
  });
};

export const userGetWeather = async () => {
  //listen for user input
  locationInputRef.addEventListener("input", async (e) => {
    //clear the old data
    _interface.clearWeather();

    locationInput = e.target.value;

    //validate
    const schema = joi.object({ location: joi.string().required().min(3) });

    try {
      await schema.validateAsync({ location: locationInput });
      errorRef.innerHTML = ``;
    } catch (error) {
      console.log("Error", error, errorRef);
      errorRef.innerHTML = `Please check you input`;
      return;
    }

    try {
      let dataFromDisk = get(locationInput);
      if (dataFromDisk) {
        choicesAPIData = dataFromDisk;
      } else {
        const { data } = await axios.get(
          `${OWM_API_URL}/geo/1.0/direct?q=${locationInput}&limit=0&appid=37b29f091f8754cf8600dea56dee3863`
        );
        choicesAPIData = data; //from the api
        set(location, data);
      }

      //make the choice
      _interface.setChoices(choicesAPIData);
    } catch (e) {
      apiErrorRef.innerHTML = `<p>API down, please try later</p>`;
    }
  });
};
