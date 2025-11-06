import type { CurrentWeather, WeatherForecast } from "./types";
import cloudyIcon from '../assets/cloudy.svg';
import foggyIcon from '../assets/foggy.svg'
import hailIcon from '../assets/hail.svg'
import partlyCloudyIcon from '../assets/partly_cloudy.svg'
import rainyIcon from '../assets/rainy.svg'
import snowyIcon from '../assets/snowy.svg'
import sunnyIcon from '../assets/sunny.svg'
import thunderstormIcon from '../assets/thunderstorm.svg'
import umbrellaIcon from '../assets/umbrella.svg'

export const currentWeather: CurrentWeather = {
    city: "New York",
    state: "NY",
    temperature: 87,
    precipitationProb: 10,
    windSpeed: 8
}

export const todayWeatherForecast: WeatherForecast = {
    date: "11/2",
    dayOfWeek: "Sunday",
    lowTemp: 70,
    highTemp: 82,
    shortForecast: "Sunny",
    svgPath: sunnyIcon,
    needUmbrella: umbrellaIcon
}


export const fiveDayWeatherForecast: WeatherForecast[] = [
    {
        date: "11/3",
        dayOfWeek: "Monday",
        lowTemp: 70,
        highTemp: 82,
        shortForecast: "Partly Cloudy",
        svgPath: partlyCloudyIcon,
        needUmbrella: null
    },
    {
        date: "11/4",
        dayOfWeek: "Tuesday",
        lowTemp: 68,
        highTemp: 72,
        shortForecast: "Cloudy",
        svgPath: cloudyIcon,
        needUmbrella: null
    },
    {
        date: "11/5",
        dayOfWeek: "Wednesday",
        lowTemp: 65,
        highTemp: 70,
        shortForecast: "Light Rain",
        svgPath: rainyIcon,
        needUmbrella: umbrellaIcon
    },
    {
        date: "11/6",
        dayOfWeek: "Thursday",
        lowTemp: 30,
        highTemp: 32,
        shortForecast: "Snowy",
        svgPath: snowyIcon,
        needUmbrella: null
    },
    {
        date: "11/7",
        dayOfWeek: "Friday",
        lowTemp: 65,
        highTemp: 70,
        shortForecast: "Thunderstorm",
        svgPath: thunderstormIcon,
        needUmbrella: umbrellaIcon
    }
]