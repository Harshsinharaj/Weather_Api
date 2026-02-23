const API_KEY = "YOUR_API_KEY";

async function searchWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name");

  // get coordinates
  const coordRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
  const coordData = await coordRes.json();
  if (coordData.cod === "404") return alert("City not found!");

  const lat = coordData.coord.lat;
  const lon = coordData.coord.lon;

  // get detailed weather
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`);
  const data = await weatherRes.json();

  displayWeather(data, city);
}

function displayWeather(data, city) {
  const current = data.current;

  const sunrise = new Date(current.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(current.sunset * 1000).toLocaleTimeString();

  document.getElementById("weatherResult").innerHTML = `
    <h3>${city}</h3>
    <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png">
    <p>Temp: ${current.temp} °C</p>
    <p>Feels like: ${current.feels_like} °C</p>
    <p>Min/Max: ${data.daily[0].temp.min} / ${data.daily[0].temp.max} °C</p>
    <p>Description: ${current.weather[0].description}</p>
    <p>Humidity: ${current.humidity}%</p>
    <p>Wind: ${current.wind_speed} m/s</p>
    <p>Sunrise: ${sunrise}</p>
    <p>Sunset: ${sunset}</p>
  `;

  showHourly(data.hourly);
  showDaily(data.daily);
}

function showHourly(hourlyData) {
  const hourDiv = document.getElementById("hourly");
  hourDiv.innerHTML = "<h4>Hourly Forecast</h4>";

  hourlyData.slice(0, 12).forEach(hour => {
    const time = new Date(hour.dt * 1000).getHours() + ":00";
    hourDiv.innerHTML += `
      <div class="hour-card">
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
        <p>${hour.temp}°C</p>
      </div>
    `;
  });
}

function showDaily(dailyData) {
  const dailyDiv = document.getElementById("daily");
  dailyDiv.innerHTML = "<h4>7-Day Forecast</h4>";

  dailyData.slice(1, 8).forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    dailyDiv.innerHTML += `
      <div class="day-card">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        <p>Min: ${day.temp.min}°</p>
        <p>Max: ${day.temp.max}°</p>
      </div>
    `;
  });
}
