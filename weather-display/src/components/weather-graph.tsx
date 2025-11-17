import { WeatherChart } from "./weather-chart"
import { WeatherChartMenu } from "./weather-chart-menu"
import { useState } from "react"
import type { chartDataType, SingleChartData, WeatherChartData } from "./types"

interface WeatherGraphProps {
    allChartData: WeatherChartData | null
}

export function WeatherGraph({allChartData}: WeatherGraphProps) {


    if (allChartData) {

        const [chartDataType, setChartDataType] = useState<chartDataType>("temperature")
        const [selectedData, setSelectedData] = useState<SingleChartData>(allChartData["temperature"])

        const updateDataType = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setChartDataType(event.currentTarget.value as chartDataType)
            setSelectedData(allChartData[event.currentTarget.value as chartDataType])
        }

        return (
            <div className="chart-section">
                <WeatherChartMenu dataType={chartDataType} updateDataType={updateDataType}/>
                <WeatherChart selectedChartData={selectedData}/>
            </div>
        )
    }

}