import { HALF_DAY_FORECAST_ENDPOINT, HOURLY_FORECASE_ENDPOINT } from "./utils"

export async function queryWeatherForecast(type: "half-day" | "hourly") {

    try {

        const res = await fetch(
            type === "half-day" ? HALF_DAY_FORECAST_ENDPOINT : HOURLY_FORECASE_ENDPOINT,
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

        return rawData


    } catch (error) {
        console.log("Failed to request weather data")
        console.log(error)
    }
}

