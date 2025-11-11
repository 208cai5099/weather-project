const HALF_DAY_FORECAST_ENDPOINT = "https://api.weather.gov/gridpoints/OKX/31,29/forecast"
const HOURLY_FORECASE_ENDPOINT = "https://api.weather.gov/gridpoints/OKX/31,29/forecast/hourly"

/**
 * Sends a GET request to get hourly weather forecasts or half-day forecasts
 * @param {string} type Specifies "half-day" or "hourly" forecasts
 * @returns A JSON object of the weather forecasts
 */
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

