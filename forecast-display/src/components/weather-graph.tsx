import { WeatherChart } from "./weather-chart"
import { WeatherChartMenu } from "./weather-chart-menu"
import { useState } from "react"
import type { chartDataType, WeatherChartData } from "./types"
import { windSpeedData, temperatureData, precipitationData, timeStamps } from './test-data'

export function WeatherGraph() {

    const [dataType, setDataType] = useState<chartDataType>("temperature")

    const updateDataType = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDataType(event.currentTarget.value as chartDataType)
    }
    

    const chartData: WeatherChartData = {
        label: dataType === "temperature" ? "Temperature (°F)" : dataType === "precipitation" ? "Precipitation %" : "Wind Speed (mph)",
        x_values: timeStamps,
        y_values: dataType === "temperature" ? temperatureData : dataType === "precipitation" ? precipitationData : windSpeedData,
        unit: dataType === "temperature" ? "°F" : dataType === "precipitation" ? "%" : "mph"
    }

    return (
        <div className="chart-section">
            <WeatherChartMenu dataType={dataType} updateDataType={updateDataType}/>
            <WeatherChart weatherChartData={chartData}/>
        </div>
    )

}