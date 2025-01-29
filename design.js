const cityInput = document.querySelector(".city-input");  
const searchButton = document.querySelector(".search-btn");  
const locationButton = document.querySelector(".location-btn");  
const currentWeatherDiv = document.querySelector(".current-weather");  
const weatherCardsDiv = document.querySelector(".weather-cards");  

const API_KEY = "46518856341d96e5f41169fdc5483975"; // OpenWeatherMap API key  

const createWeatherCard = (cityName, weatherItem, index) => {  
    const date = weatherItem.dt_txt.split(" ")[0]; // اصلاح شده  
    if (index === 0) {  
        return `  
            <div class="current-weather">  
                <div class="details">  
                    <h2>${cityName} (${date})</h2>  
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>  
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>  
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>  
                </div>  
                <div class="icon">  
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon ">  
                    <h4>${weatherItem.weather[0].description}</h4>  
                </div>  
            </div>  
        `;  
    } else {  
        return `  
            <li class="card">  
                <h2> (${date})</h2>  
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-imp">  
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>  
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>  
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>  
            </li>  
        `;  
    }  
};  

const getWeatherDetails = (cityName, lat, lon) => {  
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;  

    fetch(WEATHER_API_URL)  
        .then(res => res.json())  
        .then(data => {  
            // فیلتر کردن پیش‌بینی‌ها برای دریافت یک پیش‌بینی در هر روز  
            const uniqueForecastDays = new Set(); // استفاده از Set  
            const fiveDaysForecast = data.list.filter(forecast => {  
                const forecastDate = new Date(forecast.dt_txt).toISOString().split("T")[0];  
                if (!uniqueForecastDays.has(forecastDate)) {  
                    uniqueForecastDays.add(forecastDate);  
                    return true;  
                }  
                return false;  
            });  

            // پاک کردن داده‌های آب و هوای قبلی  
            cityInput.value = "";  
            currentWeatherDiv.innerHTML = "";  
            weatherCardsDiv.innerHTML = "";  

            // ایجاد کارت‌های آب و هوا و افزودن آن‌ها به DOM  
            fiveDaysForecast.forEach((weatherItem, index) => {  
                if (index === 0) {  
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));  
                } else {  
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));  
                }  
            });  

        })  
        .catch(error => {  
            console.error("Error fetching weather details:", error); // نمایش خطا در کنسول  
            alert("An error occurred while fetching the weather forecast!");  
        });  
};  

const getCityCoordinates = () => {  
    const cityName = cityInput.value.trim(); // دریافت نام شهر از ورودی  
    if (!cityName) return; // اگر نام شهر خالی است، برگردید  

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;  

    fetch(GEOCODING_API_URL)  
        .then(res => res.json())  
        .then(data => {  
            // دریافت مختصات شهر از پاسخ API  
            if (!data.length) return alert(`No coordinates found for ${cityName}`);  
            const { name, lat, lon } = data[0];  
            getWeatherDetails(name, lat, lon);  
        })  
        .catch(error => {  
            console.error("Error fetching coordinates:", error); // نمایش خطا در کنسول  
            alert("An error occurred while fetching the coordinates.");  
        });  
};  

const getUserCoordinates= ()=>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude , longitude} = position.coords
            const   REVERSE_GEOCODING_URL =  `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`

// Get city name form coordinates using reversing API 
            fetch(REVERSE_GEOCODING_URL)  
        .then(res => res.json())  
        .then(data => {  
            const {name}=data[0]
            getWeatherDetails(name,latitude ,longitude) 
        })  
        .catch(error => {  
            console.error("Error fetching coordinates:", error); // نمایش خطا در کنسول  
            alert("An error occurred while fetching the city!");  
        });
        },
        error =>{
            if(error.code === error.PERMISSION_DENIED)
                alert("Geolocation request denied. Please reset location permission to grant access again")
        }
    )
}


locationButton.addEventListener("click", getUserCoordinates)
// اضافه کردن لیسنر برای دکمه  
searchButton.addEventListener("click", getCityCoordinates);

cityInput.addEventListener("keyup", e=> e.key === "Enter" && getUserCoordinates())
