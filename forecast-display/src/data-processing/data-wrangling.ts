import type { WeatherForecast, WeatherPeriod } from "./types"

export function parseISODate(timestamp: string) {

    return timestamp.split("T")[0].trim()

}

export function filterDates(rawData: WeatherForecast, dayInterval: number = 5) {

    const startDate = parseISODate(new Date().toISOString())
    const endDate = parseISODate(new Date(new Date().getTime() + dayInterval * 24 * 60 * 60 * 1000).toISOString())

    const periods = rawData["properties"]["periods"].filter((record: WeatherPeriod) => 
        parseISODate(record["startTime"]) >= startDate && (parseISODate(record["endTime"]) <= endDate || parseISODate(record["startTime"]) == endDate)
    )

    return periods

}

export function extractWeatherDataValue(periods: WeatherPeriod[], type: "temperature" | "precipitation" | "wind-speed") {

    const weatherValuesMap: Map<string, (number | null)[]> = new Map()
    periods.forEach((record) => {

        const date  = parseISODate(record["startTime"])

        let value: number | null = null
        switch (type) {
            case "temperature":
                value = record["temperature"]
                break
            case "precipitation":
                value = record["probabilityOfPrecipitation"]["value"]
                break
            case "wind-speed":
                const windSpeed = record["windSpeed"].match(/[\d]+/)
                if (windSpeed) {
                    value = parseInt(windSpeed[0])
                }
                break
        }

        if (weatherValuesMap.has(date)) {
            weatherValuesMap.set(date, [...weatherValuesMap.get(date) as (number | null)[], value])
        } else {
            weatherValuesMap.set(date, [value])
        }
    })

    return weatherValuesMap

}

export function extractDailyForecastDescription(rawData: WeatherPeriod[]) {

    const forecastMap: Map<string, string> = new Map()

    rawData.forEach((record) => {

        if (!record["name"].toLowerCase().includes("night")) {
            const date = parseISODate(record["startTime"])
            forecastMap.set(date, record["shortForecast"])
        }
        
    })

    return forecastMap

}

export function findHighLowTemps(temperatureMap: Map<string, (number | null)[]>) {

    const highLowTempMap: Map<string, (number | null)[]> = new Map()

    for (const [date, tempArray] of temperatureMap.entries()) {
        const maxTemp = Math.max(...tempArray.filter((temp) => temp !== null))
        const minTemp = Math.min(...tempArray.filter((temp) => temp !== null))
        highLowTempMap.set(date, [minTemp, maxTemp])
    }

    return highLowTempMap
}