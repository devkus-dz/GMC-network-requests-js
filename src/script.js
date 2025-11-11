import axios from "axios";

const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const API_KEY = "fc438205e9af491fa70135540251111"; // Replace with your WeatherAPI key
const DEFAULT_CITY = "Algiers";


//   DOM elements  
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const weatherDetails = document.getElementById("weather-details");
const forecastSection = document.getElementById("forecast");
const forecastContainer = document.getElementById("forecast-container");
const errorMessage = document.getElementById("error-message");

const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("weather-description");
const locationText = document.getElementById("location");

const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");


//   Hide all weather sections  
const hideSections = () => {
  weatherDetails.classList.add("hidden");
  forecastSection.classList.add("hidden");
  errorMessage.classList.add("hidden");
};

//   Show an error message  
const showError = (message) => {
  hideSections();
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

//   Display current weather  
const displayCurrentWeather = (data) => {
  const {
    location: { name, country },
    current: { temp_c, feelslike_c, humidity: hum, wind_kph, condition },
  } = data;

  weatherIcon.innerHTML = `<img src="https:${condition.icon}" alt="${condition.text}" class="w-20 h-20 mx-auto" />`;
  temperature.textContent = `${temp_c}°C`;
  description.textContent = condition.text;
  locationText.textContent = `${name}, ${country}`;
  feelsLike.textContent = `${feelslike_c}°C`;
  humidity.textContent = `${hum}%`;
  windSpeed.textContent = `${wind_kph} km/h`;

  weatherDetails.classList.remove("hidden");
  errorMessage.classList.add("hidden");
};

//   Display forecast with horizontal scroll + animation  
const displayForecast = (forecastDays) => {
  forecastContainer.innerHTML = "";

  forecastDays.forEach((day, index) => {
    const { date, day: dayInfo } = day;

    const card = document.createElement("div");
    card.className =
      "flex flex-col items-center justify-center bg-blue-50 p-4 rounded-xl shadow-md text-center flex-none w-40 transform transition-all duration-500 opacity-0 scale-90";

    card.innerHTML = `
      <span class="text-sm font-medium text-blue-700 whitespace-nowrap">${new Date(
        date
      ).toDateString()}</span>
      <img src="https:${dayInfo.condition.icon}" alt="${dayInfo.condition.text}" class="w-14 h-14 my-2">
      <span class="text-lg font-bold text-blue-900">${dayInfo.avgtemp_c}°C</span>
      <span class="text-sm text-gray-600">${dayInfo.condition.text}</span>
    `;

    forecastContainer.appendChild(card);

    // Fade-in animation delay for each card
    setTimeout(() => {
      card.classList.remove("opacity-0", "scale-90");
      card.classList.add("opacity-100", "scale-100");
    }, 100 * index);
  });

  forecastSection.classList.remove("hidden");
};

//   Fetch weather data with Axios  
const getWeatherData = async (city) => {
  try {
    const url = BASE_URL + `?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=3&aqi=no&alerts=no`;

    const { data } = await axios.get(url);

    displayCurrentWeather(data);
    displayForecast(data.forecast.forecastday);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    const message =
      error.response?.data?.error?.message || "Unable to fetch weather data. Please try again.";
    showError(message);
  }
};

//   Handle form submission  
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  getWeatherData(city);
  input.value = "";
});

//   Load default city on page load  
window.addEventListener("DOMContentLoaded", () => {
  getWeatherData(DEFAULT_CITY);
});
