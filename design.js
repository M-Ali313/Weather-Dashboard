const cityInput = document.querySelector(".city-input")

const searchButton = document.querySelector(".search-btn")

const API_KEY = "46518856341d96e5f41169fdc5483975" // API key for Openweather Map API name of  myKey

const getWeatherDetails = (cityName, lat , lon)=>{
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(WEATHER_API_URL).then(res.json()).then(data=>{
        console.log(data);
    }).catch(()=>{
        alert("An error occurred while fetching the weather forecast!")
    })
}
const getCityCoordinates = ()=>{
    const cityName = cityInput.value.trim()// Get user enter the city name remove the extra space 
    if(!cityName) return // Return if cityName is empty
 const GEOCODING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
     
    fetch(GEOCODING_API_URL).then(res=> res.json()).then(data =>{
        // Get entered city coordinates (latitude , longitude, adn name ) from the API response
        if(!data.length) return alert(`No coordinates found for ${cityName}`)
            const {name, lat, lon} = data[0]
            getWeatherDetails(name,lat , lon )
    }).catch(()=>{
        alert("An error occurred while fetching the coordinates ")
    })

}
// openweathermap.org/api/geocoding-api

searchButton.addEventListener("click",getCityCoordinates)