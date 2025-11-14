import type { CurrentWeather, UpdateTimestamp, WeatherForecast } from "./types";
import cloudyIcon from '../assets/cloudy.svg';
import foggyIcon from '../assets/fog.svg'
import hailIcon from '../assets/hail.svg'
import partlyCloudyIcon from '../assets/partly_cloudy.svg'
import rainyIcon from '../assets/rain.svg'
import snowyIcon from '../assets/snow.svg'
import sunnyIcon from '../assets/sunny.svg'
import thunderstormIcon from '../assets/thunderstorm.svg'
import umbrellaIcon from '../assets/umbrella.svg'

export const windSpeedData: number[] = [8, 10, 7, 5, 10, 8, 6, 8, 12, 11, 10, 10, 8, 10, 7, 5, 10, 8, 6, 8, 12, 11, 10, 10]

export const temperatureData: number[] = [87, 86, 85, 85, 84, 83, 82, 80, 79, 79, 77, 76, 87, 86, 85, 85, 84, 83, 82, 80, 79, 79, 77, 76]

export const precipitationData: number[] = [7, 15, 25, 34, 30, 12, 17, 18, 90, 80, 60, 50, 7, 15, 25, 34, 30, 12, 17, 18, 90, 80, 60, 50]

export const timeStamps: string[] = ["1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM"]

export const updateTime: UpdateTimestamp = {
    year: 2025,
    month: 11,
    day: 2,
    hour: 11,
    minute: 3,
    dayOrNight: "AM"
}

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