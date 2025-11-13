import { getWeatherDescriptors } from "./data-processing.js";
import { getWeatherForecasts } from "./data-query.js"
import fs from "fs/promises"

const forecasts = await getWeatherForecasts()

const output = []
for (const f of forecasts) {
    const completeForecast = await getWeatherDescriptors(f)
    output.push(completeForecast)
}

await fs.writeFile("test.json", JSON.stringify(output, null, 4))
