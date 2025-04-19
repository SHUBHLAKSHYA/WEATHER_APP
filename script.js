const apiKey = "abea6b332b5c34933d47a35adc4887dc";
const weatherResult = document.getElementById("weatherResult");
const cityInput = document.getElementById("cityInput");
const favoritesContainer = document.getElementById("favorites");

let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];

function renderFavorites() {
    favoritesContainer.innerHTML = "";
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorite cities added.</p>";
        return;
    }
    favorites.forEach(city => {
        const div = document.createElement("div");
        div.className = "favorite-item";
        div.innerHTML = `
            <span onclick="getWeather('${city}')">${city}</span>
            <button class="delete-btn" onclick="removeFromFavorites('${city}')">Delete</button>
        `;
        favoritesContainer.appendChild(div);
    });
}

function addToFavorites() {
    const city = cityInput.value.trim();
    if (!city) {
        weatherResult.innerHTML = '<p class="error">Please enter a city name!</p>';
        return;
    }
    if (favorites.includes(city)) {
        weatherResult.innerHTML = '<p class="error">City already in favorites!</p>';
        return;
    }
    favorites.push(city);
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
    renderFavorites();
    weatherResult.innerHTML = `<p>${city} added to favorites!</p>`;
}

function removeFromFavorites(city) {
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
    renderFavorites();
    weatherResult.innerHTML = `<p>${city} removed from favorites!</p>`;
}


async function getWeather(cityParam) {
    const city = cityParam || cityInput.value.trim();
    if (!city) {
        weatherResult.innerHTML = '<p class="error">Please enter a city name!</p>';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found!");
        }
        const data = await response.json();

        const weather = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
        weatherResult.innerHTML = weather;
        cityInput.value = city; // Update input with the fetched city
    } catch (error) {
        weatherResult.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Allow pressing Enter to fetch weather
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

renderFavorites();