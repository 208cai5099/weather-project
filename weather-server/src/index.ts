import { queryWeatherForecast } from "./api-query.js";
import { filterDates, parseHourlyForecasts, parseHalfDayForecasts } from "./data-wrangling.js"
import { ForecastEntry } from "./types.js";

async function getWeatherForecasts(dayInterval: number = 5, timeZone: string = "America/New_York"): Promise<Partial<ForecastEntry>[]> {

    const halfDayJSON = await queryWeatherForecast("half-day")
    const hourlyJSON = await queryWeatherForecast("hourly")

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

    const hourlyForecasts = parseHourlyForecasts(filterDates(hourlyJSON, dateInterval))
    const halfDayForecasts = parseHalfDayForecasts(filterDates(halfDayJSON, dateInterval))

    const combinedForecasts: Partial<ForecastEntry>[] = []
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

    console.log(combinedForecasts[0])
    return combinedForecasts


}

getWeatherForecasts()