let searchBtn = document.querySelector(".search-button");
let searchBtnMobile = document.querySelector(".search-button-mobile");
searchBtnMobile.addEventListener("click", handleMobileSearch);
searchBtn.addEventListener("click", handleSearch);
const currentLocation=document.querySelector(".current-location-container");
currentLocation.addEventListener("click",getCurrentLocationWeather);
api_key = "d8648784e60e8791c06e2b96d64cc3b2";

// Fetch weather details on page load
document.addEventListener("DOMContentLoaded",()=>{
  getCurrentLocationWeather();
})

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
      console.log("Error fetching coordinates:", error);
    });

    const forecastAPI=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;
    fetch(forecastAPI).then((response)=>response.json()).then((data)=>{
        updateForecastUI(data);
    })
}

function updateWeatherDetailsUI(weatherData) {
    const weatherDetails = document.querySelector(".weather-details");
    const currentWeatherIconElement = document.querySelector(".weather-icon");
  //  Update date
  const currentDay = document.querySelector(".current-date");
  currentDay.textContent = getFormattedDate(weatherData.dt);
  // Update temperature
  const temperature = document.querySelector(".current-temperature");
  temperature.textContent = `${Math.round(weatherData.main.temp)} °C`;

  // Update weather icon
    const weatherIcon=weatherData.weather[0].icon;
    currentWeatherIconElement.src=`https://openweathermap.org/img/wn/${weatherIcon}.png`;
  // Update location
  const location = document.querySelector(".location");
  location.textContent = `${weatherData.name},${weatherData.sys.country}`;
  weatherDetails.innerHTML="";
  //  Update humidity
  const humidity = document.createElement("p");
  humidity.classList.add("current-humidity");
  humidity.textContent = `Humidity: ${weatherData.main.humidity} %`;
  weatherDetails.appendChild(humidity);
  
  // Update wind speed
  const windSpeed = document.createElement("p");
  windSpeed.classList.add("wind-speed");
  windSpeed.textContent = `Wind speed: ${weatherData.wind.speed}m/s`;
  weatherDetails.appendChild(windSpeed);
}

//  Get the formatted date
function getFormattedDate(dateData) {
  const dateObj = new Date(dateData * 1000);
  const date = dateObj.getDate();
  const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  return `${day}, ${month} ${date}`;
}

// Update forecast UI
function updateForecastUI(forecastData){
    const dayForecast={};
    forecastData.list.forEach(forecast=>{
        const date=new Date(forecast.dt*1000).toLocaleDateString();
            if(!dayForecast[date]){
                dayForecast[date]=[];
            }
            dayForecast[date].push(forecast);
    });
    const forecastDays=Object.keys(dayForecast).slice(1,6);

    // Update forecast cards UI
    const forecastContainer=document.getElementsByClassName("forecast-card-container")[0];
    forecastContainer.innerHTML="";
    forecastDays.forEach((day)=>{
        const dayData=dayForecast[day];
        const date=getFormattedDate(dayData[0].dt);
        const dayTemperature=dayData[0].main.temp;
        const dayIcon=dayData[0].weather[0].icon;
        const dayHumidity=dayData[0].main.humidity;
        const dayWindSpeed=dayData[0].wind.speed;
        // Create forecast card
        const forecastCard=document.createElement("div");
        forecastCard.classList.add("forecast-card","border-2","rounded-2xl","p-2");
        forecastCard.innerHTML=`
          <h2 class="text-center text-black font-semibold">${date}</h2>
          <p class="text-4xl font-semibold text-center text-white my-2">${Math.round(dayTemperature)}°C</p>
          <p class="text-black font-bold text-sm">Humidity : ${dayHumidity}%</p>
          <p class="text-black font-bold text-sm">Wind Speed : ${dayWindSpeed} m/s</p>
          <div>
            <img
              class="weather-icon m-auto"
              src="https://openweathermap.org/img/wn/${dayIcon}.png"
              alt="logo"
              width="45%"
            />
          </div>`;
        forecastContainer.appendChild(forecastCard);
    });
}

// Get current location weather
function getCurrentLocationWeather(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
      const lat=position.coords.latitude;
      const lon=position.coords.longitude;
     getCurrentWeatherByCoordinates(lat,lon);
    });
  }
  else{
    alert("Geolocation is not supported by this browser.");
  }
}

// Fetch weather by coordinates
function getCurrentWeatherByCoordinates(lat,lon){
  const weatherAPI=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
  fetch(weatherAPI).then((response)=>response.json()).then((data)=>{
    updateWeatherDetailsUI(data);

  }).catch((error)=>{
    console.log("Error fetching current location weather:",error);
  });

  const forecastAPI=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
  fetch(forecastAPI).then((response)=>response.json()).then((data)=>{
    updateForecastUI(data);
  }).catch((error)=>{
    console.log("Error fetching current location forecast:",error);
  })
}

