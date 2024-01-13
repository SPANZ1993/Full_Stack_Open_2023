import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_OPEN_WEATHER_KEY



const getWeather = (lat, lon) => {
    const request = axios.get(baseUrl.concat(`?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`))
    return request.then(response => response.data)
}

const getWeatherIconUrl = (weather) => {
    return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
}


export default {getWeather, getWeatherIconUrl}