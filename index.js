let searchBtn = document.querySelector(".search-button");
let searchBtnMobile = document.querySelector(".search-button-mobile");
searchBtnMobile.addEventListener("click", handleMobileSearch);
searchBtn.addEventListener("click", handleSearch);
api_key = "d8648784e60e8791c06e2b96d64cc3b2";

// Validate city name input
function validateCityName(cityName) {
  let isValid = true;
  if (cityName === "") {
    const searchDiv = document.querySelector(".search");
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("error");
    errorMsg.innerHTML = "Please enter a city name";
    const error = document.querySelector(".error");
    if (!error) {
      searchDiv.appendChild(errorMsg);
    }
    isValid = false;
  }
  return isValid;
}

// Handle search button click
function handleSearch() {
  const cityInput = document.querySelector(".location-input");
  const cityName = cityInput.value;
  const isValid = validateCityName(cityName);
  if (isValid) {
    getWeatherByCityName(cityName);
    cityInput.value = "";
  } 
 
}

// Handle mobile search button click
function handleMobileSearch() {
  const cityInput = document.querySelector(".location-input-mobile");
  const cityName = cityInput.value;
  const isValid = validateCityName(cityName);
  if (isValid) {
    getWeatherByCityName(cityName);
    cityInput.value = "";
  }
}

// Fetch current weather details by city name
function getWeatherByCityName(city) {
  let cityNameAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
  fetch(cityNameAPI)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        const searchDiv = document.querySelector(".search");
        const errorMsg = document.createElement("p");
        errorMsg.classList.add("error");
        errorMsg.innerHTML = data.message;
        const error = document.querySelector(".error");
        if (!error) {
          searchDiv.appendChild(errorMsg);
        }
        return;
      }
      updateWeatherDetailsUI(data);
    })
    .catch((error) => {
      debugger;
      console.log("Error fetching coordinates:", error);
    });
}

function updateWeatherDetailsUI(weatherData) {
  const weatherDetails = document.querySelector(".weather-details");
  //  Update date
  const currentDay = document.querySelector(".current-date");
  currentDay.textContent = getFormattedDate(weatherData.dt);
  // Update temperature
  const temperature = document.querySelector(".current-temperature");
  temperature.textContent = `${Math.round(weatherData.main.temp)} °C`;
  // Update location
  const location = document.querySelector(".location");
  location.textContent = `${weatherData.name},${weatherData.sys.country}`;
  //  Update humidity
  const humidity = document.createElement("p");
  humidity.classList.add("current-humidity");
  const currentHumidity = document.querySelector(".current-humidity");
  humidity.textContent = `Humidity :${weatherData.main.humidity} %`;
  
  // Update wind speed
  const windSpeed = document.createElement("p");
  windSpeed.classList.add("wind-speed");
  const currentWindSpeed = document.querySelector(".wind-speed");
  windSpeed.textContent = `Wind speed : ${weatherData.wind.speed}m/s`;
}

//  Get the formatted date
function getFormattedDate(dateData) {
  const dateObj = new Date(dateData * 1000);
  const date = dateObj.getDate();
  const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  return `${day}, ${month} ${date}`;
}
