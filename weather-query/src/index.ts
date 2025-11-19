import { getWeatherDescriptors } from "./data-processing.js"
import { getWeatherForecasts } from "./data-query.js"
import { ForecastEntry } from "./types.js"
import dotenv from "dotenv"
// import fs from "fs/promises"


dotenv.config()

/**
 * Loads the given array of ForecastEntry objects to a database
 * @returns A Promise of void 
 */
async function sendToDatabase(forecastEntryArray: ForecastEntry[]) {

    const endpoint = process.env.DATABASE_LOAD_ENDPOINT as string

    try {
        const res = await fetch(endpoint,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(forecastEntryArray)
            }
        )

        if (!res.ok) {

            console.log("Failed to load forecast data")

        } else {

            const resJSON = await res.json()
            console.log(resJSON)

        }

    } catch (error) {

        console.log(error)

    }


}

/**
 * Facilitates the querying of weather data, processing of the data, and loading the 
 * processed data into the database
 * @returns A Promise of void
 */
async function App() {

    try {

        const forecasts = await getWeatherForecasts()

        const output: ForecastEntry[] = []
        for (const f of forecasts) {
            const completeForecast = await getWeatherDescriptors(f)
            output.push(completeForecast)
        }

        await sendToDatabase(output)

    } catch (error) {

        console.log(error)

    }    

}

// run the app
try {
    await App()
} catch (error) {
    console.log(error)
}
