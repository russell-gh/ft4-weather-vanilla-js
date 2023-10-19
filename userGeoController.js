import { Interface } from "./interface.js";
import { get, set } from "./storage/sorageUtils.js";
const locationInputRef = document.getElementById("location");
const errorRef = document.getElementById("error");
const choicesRef = document.getElementById("choices");

let locationInput = "";
let choicesAPIData;

const _interface = new Interface();

export const listenForChoice = () => {
  choicesRef.addEventListener("click", async (e) => {
    console.log(e.target.id);
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
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=37b29f091f8754cf8600dea56dee3863`
    );

    //task to the setInterface stuff and it can sort the interface
    _interface.setInterface(weather.data);
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
      errorRef.innerHTML = `
      `;
      let dataFromDisk = get(locationInput);
      if (dataFromDisk) {
        choicesAPIData = dataFromDisk;
      } else {
        const { data } = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=0&appid=37b29f091f8754cf8600dea56dee3863`
        );
        choicesAPIData = data; //from the api
      }

      //make the choice
      _interface.setChoices(choicesAPIData);
    } catch (error) {
      console.log("Error", error, errorRef);
      errorRef.innerHTML = `Please check you input`;
    }
  });
};
