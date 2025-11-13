import { getWeatherDescriptors } from "./data-processing.js";
import { getWeatherForecasts } from "./data-query.js"
import { ForecastEntry } from "./types.js";


const DATABASE_LOAD_ENDPOINT = "http://0.0.0.0:8000/load/"


async function sendToDatabase(forecastEntryArray: Partial<ForecastEntry>[]) {

    try {
        const res = await fetch(DATABASE_LOAD_ENDPOINT,
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


async function App() {

    try {

    
        const forecasts = await getWeatherForecasts()

        const output = []
        for (const f of forecasts) {
            const completeForecast = await getWeatherDescriptors(f)
            output.push(completeForecast)
        }

        await sendToDatabase(output)

    } catch (error) {

        console.log(error)

    }    

}


try {
    await App()
} catch (error) {
    console.log(error)
}
