import type { ForecastEntry, WeatherForecast, WeatherPeriod } from "./types.js"

/**
 * Parse a ISO-formatted datetime and return the date at a specific time zone
 * @param {string} timestamp 
 * @returns {string}
 */
export function parseISODate(timestamp: string, timeZone: string = "America/New_York"): string {

    const inputDatetime = new Date(timestamp)
    const DateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "numeric", 
        minute: "numeric",
        hour12: true,
        timeZone: timeZone
    }
    const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", DateTimeFormatOptions)
    const formattedTimestamp = dateTimeFormatter.format(inputDatetime)

    const [date, time] =  formattedTimestamp.split(", ")
    return date as string

}

/**
 * Parses a JSON object of weather forecast data from a start date to an end date
 * @param {WeatherForecast} rawData 
 * @param {string[]} dateInterval
 * @returns {WeatherPeriod[]} An array of forecast details (temp, wind speed, precipiation prob, etc.) from a start date to an end date
 */
export function filterDates(rawData: WeatherForecast, dateInterval: string[]): WeatherPeriod[] {

    const periods = rawData["properties"]["periods"].filter((record: WeatherPeriod) => 
        dateInterval.includes(parseISODate(record["startTime"])) || dateInterval.includes(parseISODate(record["endTime"]))
    )

    return periods

}

/**
 * Parses an array of forecast details and creates an array of partial ForecastEntry
 * objects with each date, day of week, temp array, precipitation array, and wind speed array
 * @param {WeatherPeriod[]} periods 
 * @returns {Partial<ForecastEntry>[]} 
 */
export function parseHourlyForecasts(periods: WeatherPeriod[], timeZone: string = "America/New_York"): Partial<ForecastEntry>[] {

    const DateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit", 
        hour: "numeric", 
        minute: "numeric",
        hour12: true,
        timeZone: timeZone
    }
    const dateTimeFormatter = new Intl.DateTimeFormat("en-CA", DateTimeFormatOptions)

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
        const [date, time]  = dateTimeFormatter.format(recordDate).split(", ")
        const temperature = record["temperature"]
        const precipitation = record["probabilityOfPrecipitation"]["value"]
        const windSpeedRegexMatch = record["windSpeed"].match(/[\d]+/)
        const windSpeed = windSpeedRegexMatch ? parseInt(windSpeedRegexMatch[0]) : null

        const forecastIndex = weatherForecastArray.findIndex((forecast) => forecast.date === date)
        if (forecastIndex === -1) {
            weatherForecastArray.push({
                date: date,
                dayOfWeek: dayOfWeek,
                forecastArrays: {
                    timeArray: [time],
                    tempArray: [temperature],
                    precipitationProbArray: [precipitation],
                    windSpeedArray: [windSpeed]
                },
                lowTemp: temperature,
                highTemp: temperature
            })
        } else {
            const entry = weatherForecastArray[forecastIndex] as Partial<ForecastEntry>
            entry?.forecastArrays?.timeArray.push(time)
            entry?.forecastArrays?.tempArray?.push(temperature)
            entry?.forecastArrays?.precipitationProbArray?.push(precipitation)
            entry?.forecastArrays?.windSpeedArray?.push(windSpeed)
            entry.lowTemp = Math.min(temperature, entry.lowTemp as number)
            entry.highTemp = Math.max(temperature, entry.highTemp as number)
            weatherForecastArray[forecastIndex] = entry
        }

    })

    return weatherForecastArray

}


/**
 * Parses an array of half-day forecast details and creates an array of partial ForecastEntry
 * objects with forecast descriptions (only daytime data are kept)
 * @param {WeatherPeriod[]} periods 
 * @returns {Partial<ForecastEntry>[]} 
 */
export function parseHalfDayForecasts(periods: WeatherPeriod[]): Partial<ForecastEntry>[] {

    const weatherForecastArray: Partial<ForecastEntry>[] = []
    periods.forEach((record) => {

        if (record["isDaytime"]) {
            const date = parseISODate(record["startTime"])
            const shortForecast = record["shortForecast"]
            const detailedForecast = record["detailedForecast"]

            weatherForecastArray.push({
                date: date,
                shortDaytimeForecast: shortForecast,
                detailedDaytimeForecast: detailedForecast
            })
        }
        
    })

    return weatherForecastArray

}