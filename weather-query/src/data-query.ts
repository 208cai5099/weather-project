import type { ForecastEntry, WeatherForecast, WeatherPeriod } from "./types.js"
import dotenv from 'dotenv'

dotenv.config()

/**
 * Sends a GET request to get hourly weather forecasts or half-day forecasts
 * @returns A Promise of a JSON object of the weather forecasts
 */
export async function queryWeatherForecast(type: "half-day" | "hourly") {

    const endpoint = (type === "half-day") ? process.env.HALF_DAY_FORECAST_ENDPOINT as string : process.env.HOURLY_FORECAST_ENDPOINT as string

    try {

        const res = await fetch(
            endpoint,
            {
                method: "GET",
                headers: {
                    "User-Agent" : "personal-weather-app"
                }
            }
        )

        if (!res.ok) {
            throw new Error(`Failed to request weather data. Response status: ${res.status}`)
        }

        const rawData = await res.json()

        return rawData as WeatherForecast


    } catch (error) {
        console.log("Failed to request weather data")
        console.log(error)
    }
}


/**
 * Parse a ISO-formatted datetime for the date at a specific time zone
 * @returns The date of the given timestamp
 */
export function parseISODate(timestamp: string, timeZone: string = "America/New_York"): string {

    const inputDatetime = new Date(timestamp)
    const DateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        timeZone: timeZone
    }
    const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", DateTimeFormatOptions)
    const formattedTimestamp = dateTimeFormatter.format(inputDatetime)
    const date = formattedTimestamp.split(", ")[0]

    return date

}

/**
 * Parses an unprocessed API JSON response for only the forecast details
 * @returns An array of forecast details (temp, wind speed, precipiation prob, etc.)
 */
export function filterForWeatherPeriods(rawData: WeatherForecast): WeatherPeriod[] {
    
    return rawData["properties"]["periods"]

}

/**
 * Parses an array of forecast details and creates an array of partial ForecastEntry
 * objects containing date, day of week, temp array, precipitation array, and wind speed array
 * @returns An array of partial ForecastEntry objects with daily weather details
 */
export function parseHourlyForecasts(periods: WeatherPeriod[]): Partial<ForecastEntry>[] {

    const dayOfWeekMapper: Record<number, "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"> = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }

    const weatherForecastArray: Partial<ForecastEntry>[] = []
    periods.forEach((record) => {

        const recordDate = new Date(record["startTime"])
        const dayOfWeek = dayOfWeekMapper[recordDate.getDay()]
        const date = `${recordDate.getFullYear()}-${recordDate.getMonth() + 1}-${recordDate.getDate() < 10 ? "0" + recordDate.getDate().toString() : recordDate.getDate()}`
        const hour = recordDate.getHours()
        const formattedTime = hour < 10 ? `0${hour}:00` : `${hour}:00`
        const temperature = record["temperature"]
        const precipitation = record["probabilityOfPrecipitation"]["value"]
        const windSpeedRegexMatch = record["windSpeed"].match(/[\d]+/) as RegExpMatchArray
        const windSpeed = parseInt(windSpeedRegexMatch[0])
        const shortForecast = record["shortForecast"]

        const forecastIndex = weatherForecastArray.findIndex((forecast) => forecast.date === date)
        if (forecastIndex === -1) {
            weatherForecastArray.push({
                location: "New York",
                date: date,
                dayOfWeek: dayOfWeek,
                hourlyForecast: {[formattedTime]: shortForecast},
                hourlyTemp: {[formattedTime] : temperature},
                hourlyPrecipitation: {[formattedTime]: precipitation},
                hourlyWindSpeed: {[formattedTime]: windSpeed}
            })
        } else {
            const entry = weatherForecastArray[forecastIndex] as Partial<ForecastEntry>
            entry.hourlyForecast = {...entry.hourlyForecast, [formattedTime]: shortForecast}
            entry.hourlyTemp = {...entry.hourlyTemp, [formattedTime]: temperature}
            entry.hourlyPrecipitation = {...entry.hourlyPrecipitation, [formattedTime]: precipitation}
            entry.hourlyWindSpeed = {...entry.hourlyWindSpeed, [formattedTime]: windSpeed}
            weatherForecastArray[forecastIndex] = entry
        }

    })

    return weatherForecastArray

}


/**
 * Parses an array of half-day forecast details and creates an array of partial ForecastEntry
 * objects with forecast descriptions
 * @returns An array of partial ForecastEntry objects containing daily weather details
 */
export function parseHalfDayForecasts(periods: WeatherPeriod[]): Partial<ForecastEntry>[] {

    const weatherForecastArray: Partial<ForecastEntry>[] = []

    periods.forEach((record) => {

        const index = weatherForecastArray.findIndex((element) => element["date"] === parseISODate(record["startTime"]))

        if (index === -1) {

            // make new entry for this date
            const weatherRecord: Partial<ForecastEntry> = {
                date: parseISODate(record["startTime"]),
                location: "New York",
                shortDaytimeForecast: "",
                detailedDaytimeForecast: "",
                shortNighttimeForecast: "",
                detailedNighttimeForecast: ""
            }

            // insert daytime or nighttime data
            if (record["isDaytime"]) {
                weatherRecord["shortDaytimeForecast"] = record["shortForecast"]
                weatherRecord["detailedDaytimeForecast"] = record["detailedForecast"]
            } else {
                weatherRecord["shortNighttimeForecast"] = record["shortForecast"]
                weatherRecord["detailedNighttimeForecast"] = record["detailedForecast"]
            }

            weatherForecastArray.push(weatherRecord)

        } else {

            // if an entry already exists for this date, insert daytime or nighttime data
            if (record["isDaytime"]) {
                weatherForecastArray[index]["shortDaytimeForecast"] = record["shortForecast"]
                weatherForecastArray[index]["detailedDaytimeForecast"] = record["detailedForecast"]
            } else {
                weatherForecastArray[index]["shortNighttimeForecast"] = record["shortForecast"]
                weatherForecastArray[index]["detailedNighttimeForecast"] = record["detailedForecast"]
            }
        }
        
    })

    return weatherForecastArray

}

/**
 * Queries the API for the weather forecasts in the given time range and time zone
 * @returns A Promise of an array of partial ForecastEntry objects containing parsed weather data
 */
export async function getWeatherForecasts(): Promise<Partial<ForecastEntry>[]> {

    const combinedForecasts: Partial<ForecastEntry>[] = []

    const halfDayJSON = await queryWeatherForecast("half-day")
    const hourlyJSON = await queryWeatherForecast("hourly")

    if (halfDayJSON && hourlyJSON) {

        const hourlyForecasts = parseHourlyForecasts(filterForWeatherPeriods(hourlyJSON))
        const halfDayForecasts = parseHalfDayForecasts(filterForWeatherPeriods(halfDayJSON))

        for (const forecast1 of hourlyForecasts) {
            let match = false
            for (const forecast2 of halfDayForecasts) {

                if (forecast1.date === forecast2.date) {
                    combinedForecasts.push({...forecast1, ...forecast2})
                    match = true
                    break
                }
            }

            if (!match) {
                combinedForecasts.push(forecast1)
            }
        }

    }

    // if the half day forecasts are not available yet, set them to be empty
    for (let i = 0; i < combinedForecasts.length; i++) {

        const forecast = combinedForecasts[i]
        
        if (!Object.keys(forecast).includes("shortDaytimeForecast")) {
            forecast["shortDaytimeForecast"] = ""
            forecast["detailedDaytimeForecast"] = ""
        }

        if (!Object.keys(forecast).includes("shortNighttimeForecast")) {
            forecast["shortNighttimeForecast"] = ""
            forecast["detailedNighttimeForecast"] = ""
        }

        combinedForecasts[i] = forecast
    }

    return combinedForecasts

}