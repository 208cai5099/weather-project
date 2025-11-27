import type { CurrentWeather, ForecastEntry, WeatherChartData, WeatherForecast } from "./types"
import cloudyIcon from '../assets/cloudy.svg';
import foggyIcon from '../assets/fog.svg'
import hailIcon from '../assets/hail.svg'
import partlyCloudyIcon from '../assets/partly_cloudy.svg'
import rainyIcon from '../assets/rain.svg'
import snowyIcon from '../assets/snow.svg'
import sunnyIcon from '../assets/sunny.svg'
import thunderstormIcon from '../assets/thunderstorm.svg'
import windyIcon from '../assets/wind.svg'
import questionIcon from '../assets/question_mark.svg'
import umbrellaIcon from '../assets/umbrella.svg'
import clearNighttimeIcon from '../assets/clear_nighttime.svg'
import partlyClearNighttimeIcon from '../assets/partly_clear_nighttime.svg'

/**
 * Fetches weather data within the provided time range, location, and time zone
 * @returns An array of ForecastEntry (each one contains a single day's data)
 */
export async function queryWeatherDB(dayInterval: number, location: string, timeZone: string) {

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: timeZone
    }
    const dateFormatter = new Intl.DateTimeFormat("en-CA", dateFormatOptions)

    const currentDate = new Date()
    const dateInterval: string[] = []
    for (let i = 0; i < dayInterval + 1; i++) {
        const targetDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000)
        dateInterval.push(dateFormatter.format(targetDate))
    }

    // append the date and location parameters to the database endpoint
    const endpoint = import.meta.env.VITE_WEATHER_DB_ENDPOINT
    const queryParams = new URLSearchParams()
    for (const date of dateInterval) {
        queryParams.append("dates", date)
        queryParams.append("locations", location)
    }

    try {

        const res = await fetch(
            `${endpoint}?${queryParams.toString()}`,
            {
                method: "GET"            
            }
        )

        const resJSON = await res.json()

        return resJSON as ForecastEntry[]
        
    } catch (error) {
        console.log(error)
    }

}

/**
 * Determines the SVG that best corresponds to the given weather descriptor
 * @returns The string representing the SVG
 */
function determineSVG(descriptor: string) {

    if (descriptor.includes("fog")) {
        return foggyIcon
    } else if (descriptor.includes("hail")) {
        return hailIcon
    } else if (descriptor.includes("snow")) {
        return snowyIcon
    } else if (descriptor.includes("rain")) {
        return rainyIcon
    } else if (descriptor.includes("thunderstorm")) {
        return thunderstormIcon
    } else if (descriptor.includes("windy")) {
        return windyIcon
    } else if (descriptor.includes("sunny")) {
        if (descriptor.includes("partly")) return partlyCloudyIcon
        else return sunnyIcon
    } else if (descriptor.includes("cloudy")) {
        if (descriptor.includes("partly")) return partlyCloudyIcon
        else return cloudyIcon
    } else if (descriptor.includes("clear")) {
        const currentDatetime = new Date()
        const isDaytime = currentDatetime.getHours() >= 6 && currentDatetime.getHours() <= 18 ? true : false
        if (isDaytime) {
            if (descriptor.includes("partly")) return partlyCloudyIcon
            else return sunnyIcon
        } else {
            if (descriptor.includes("partly")) return partlyClearNighttimeIcon
            else return clearNighttimeIcon
        }
    }

    return questionIcon

}

/**
 * Determines whether an umbrella is needed based on the given weather descriptor
 * @returns Either a string representing the umbrella SVG or null
 */
function determineUmbrella(descriptor: string) {
    if (descriptor.includes("rain") || descriptor.includes("thunderstorm")) return umbrellaIcon
    return null
}

/**
 * Re-formats the data in the given ForecastEntry object for display
 * @returns A WeatherForecast object representing a single day's forecast info
 */
export function parseWeatherForecast(forecastEntry: ForecastEntry) {

    const weatherForecast: Partial<WeatherForecast> = {}
    weatherForecast["date"] = forecastEntry["date"].split("-")[1] + "/" + forecastEntry["date"].split("-")[2]
    weatherForecast["dayOfWeek"] = forecastEntry["dayOfWeek"]
    weatherForecast["lowTemp"] = Math.min(...Object.values(forecastEntry["hourlyTemperature"]))
    weatherForecast["highTemp"] = Math.max(...Object.values(forecastEntry["hourlyTemperature"]))
    weatherForecast["daytimeForecast"] = {
        forecast: forecastEntry["daytimeWeatherDescriptor"],
        svgPath: determineSVG(forecastEntry["daytimeWeatherDescriptor"].toLowerCase()),
        needUmbrella: determineUmbrella(forecastEntry["daytimeWeatherDescriptor"].toLowerCase())
    }
    weatherForecast["nighttimeForecast"] = {
        forecast: forecastEntry["nighttimeWeatherDescriptor"],
        svgPath: determineSVG(forecastEntry["nighttimeWeatherDescriptor"].toLowerCase()),
        needUmbrella: determineUmbrella(forecastEntry["nighttimeWeatherDescriptor"].toLowerCase())
    }

    return weatherForecast as WeatherForecast

}

/**
 * Parses a ForecastEntry object for the current hour's weather info
 * @returns A CurrentWeather object showing the weather in the current hour
 */
export function parseCurrentWeather(forecastEntry: ForecastEntry) {

    let currentHour = new Date().getHours().toString() + ":00"
    if (new Date().getHours() < 10) {
        currentHour = "0" + currentHour
    }

    const currentWeather: Partial<CurrentWeather> = {}
    currentWeather["location"] = forecastEntry["location"]
    currentWeather["temperature"] = forecastEntry["hourlyTemperature"][currentHour]
    currentWeather["precipitationProb"] = forecastEntry["hourlyPrecipitation"][currentHour]
    currentWeather["windSpeed"] = forecastEntry["hourlyWindSpeed"][currentHour]
    currentWeather["forecast"] = forecastEntry["hourlyForecast"][currentHour]
    currentWeather["svgPath"] = determineSVG(forecastEntry["hourlyForecast"][currentHour].toLowerCase())
    currentWeather["needUmbrella"] = determineUmbrella(forecastEntry["hourlyForecast"][currentHour].toLowerCase())

    return currentWeather as CurrentWeather
}

/**
 * Converts a given time from military time format to AM/PM format
 * @returns 
 */
function formatHour(time: string) {
    
    const hour = parseInt(time.split(":")[0])

    if (hour === 0) {
        return "12AM"
    } else if (hour == 12) {
        return "12PM"
    } else {
        return hour < 12 ? `${hour % 12}AM` : `${hour % 12}PM`
    }
    

}

/**
 * Parses a ForecastEntry object for the hourly temperature, precipitation probability, 
 * and wind speed (used for chart visualization)
 * @returns A WeatherChartData object with the hourly weather details
 */
export function parseHourlyData(forecastEntry: ForecastEntry) {

    const hourlyTemp = forecastEntry["hourlyTemperature"]
    const hourlyPrecipitation = forecastEntry["hourlyPrecipitation"]
    const hourlyWindSpeed = forecastEntry["hourlyWindSpeed"]

    const weatherData: WeatherChartData = {
        temperature: {
            label: "Temperature (°F)",
            xValues: Object.keys(hourlyTemp).map(time => formatHour(time)),
            yValues: Object.values(hourlyTemp),
            unit: "°F"
        },
        precipitation: {
            label: "Precipitation %",
            xValues: Object.keys(hourlyPrecipitation).map(time => formatHour(time)),
            yValues: Object.values(hourlyPrecipitation),
            unit: "%"
        },
        windSpeed: {
            label: "Wind Speed (mph)",
            xValues: Object.keys(hourlyWindSpeed).map(time => formatHour(time)),
            yValues: Object.values(hourlyWindSpeed),
            unit: "mph"
        }
    }

    return weatherData

}