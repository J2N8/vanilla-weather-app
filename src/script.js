function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="days-col col">
        <div class="days">
          <p>
            <span class="days-weekday">${formatDay(forecastDay.dt)}</span>
          </p>
          <p class="days-temp">
            <span class="forcast-max"> ${Math.round(
              forecastDay.temp.max
            )}°</span>
            <span class="forcast-min"> ${Math.round(
              forecastDay.temp.min
            )}°</span>
          </p>
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt="" />
        </div>
      </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "da9262d37e70731f4340ddaf099c8e7e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeatherDescription(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  fahrenheitTemperature = response.data.main.temp;

  document.querySelector("#main-temp").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchingCity(city) {
  let apiKey = "da9262d37e70731f4340ddaf099c8e7e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showWeatherDescription);
}

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchingCity(city);
}

function showLocation(position) {
  let apiKey = "da9262d37e70731f4340ddaf099c8e7e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(showWeatherDescription);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}
let fahrenheitTemperature = null;

function convertingToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.add("link-active");
  fahrenheitLink.classList.remove("link-active");
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertingToFahrenheit);

function convertingToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.remove("link-active");
  fahrenheitLink.classList.add("link-active");
  let celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertingToCelsius);

let dateElement = document.querySelector("#date-line");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let locationbutton = document.querySelector("#locator-button");
locationbutton.addEventListener("click", getCurrentLocation);

searchingCity("Tampa");
