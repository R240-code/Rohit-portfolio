const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const temperatureDetail = document.getElementById("temperature-detail");

// Convert Open-Meteo weather codes into readable conditions.
function getWeatherCondition(code) {
const conditions = {
0: "Clear sky",
1: "Mainly clear",
2: "Partly cloudy",
3: "Overcast",
45: "Fog",
48: "Depositing rime fog",
51: "Light drizzle",
53: "Moderate drizzle",
55: "Dense drizzle",
61: "Slight rain",
63: "Moderate rain",
65: "Heavy rain",
71: "Slight snowfall",
73: "Moderate snowfall",
75: "Heavy snowfall",
80: "Slight rain showers",
81: "Moderate rain showers",
82: "Violent rain showers",
95: "Thunderstorm",
96: "Thunderstorm with slight hail",
99: "Thunderstorm with heavy hail"
};


return conditions[code] || "Unknown weather condition";


}

// Display a simple weather icon based on the weather code.
function getWeatherEmoji(code) {
if (code === 0) return "☀️";
if (code === 1 || code === 2) return "🌤️";
if (code === 3) return "☁️";
if ([45, 48].includes(code)) return "🌫️";
if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
return "🌧️";
}
if ([71, 73, 75].includes(code)) return "❄️";
if ([95, 96, 99].includes(code)) return "⛈️";


return "🌡️";


}

weatherForm.addEventListener("submit", async function (event) {
event.preventDefault();


const city = cityInput.value.trim();

if (!city) {
    message.textContent = "Please enter a city name.";
    weatherResult.hidden = true;
    return;
}

message.textContent = "Loading weather data...";
weatherResult.hidden = true;

try {
    // Step 1: Find the city's latitude and longitude.
    const geocodingURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geocodingURL);

    if (!geoResponse.ok) {
        throw new Error("Unable to find the city. Please try again.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
    }

    const location = geoData.results[0];

    // Step 2: Get current weather using the coordinates.
    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
        throw new Error("Unable to fetch weather data. Please try again.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Step 3: Display the weather on the webpage.
    cityName.textContent =
        `${location.name}, ${location.country}`;

    temperature.textContent =
        `${Math.round(current.temperature_2m)}°C`;

    condition.textContent =
        getWeatherCondition(current.weather_code);

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    temperatureDetail.textContent =
        `${Math.round(current.apparent_temperature)}°C feels like`;

    // Use an emoji instead of an external weather icon.
    weatherIcon.removeAttribute("src");
    weatherIcon.alt = getWeatherCondition(current.weather_code);
    weatherIcon.style.display = "none";

    let emoji = document.getElementById("weather-emoji");

    if (!emoji) {
        emoji = document.createElement("div");
        emoji.id = "weather-emoji";
        emoji.style.fontSize = "60px";
        emoji.style.margin = "10px 0";

        weatherIcon.insertAdjacentElement("afterend", emoji);
    }

    emoji.textContent = getWeatherEmoji(current.weather_code);
    emoji.style.display = "block";

    weatherResult.hidden = false;
    message.textContent = "";

} catch (error) {
    weatherResult.hidden = true;
    message.textContent = error.message;
}


});
