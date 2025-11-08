import type { chartDataType } from "./types"

interface WeatherChartMenuProps {
    dataType: chartDataType
    updateDataType: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function WeatherChartMenu({dataType, updateDataType}: WeatherChartMenuProps) {

    return (

        <div className="weather-chart-menu">
            <button value="temperature" className={dataType === "temperature" ? "temperature-button-clicked" : "temperature-button"} onClick={updateDataType}></button>
            <button value="precipitation" className={dataType === "precipitation" ? "precipitation-button-clicked" : "precipitation-button"} onClick={updateDataType}></button>
            <button value="wind-speed" className={dataType === "wind-speed" ? "wind-speed-button-clicked" : "wind-speed-button"} onClick={updateDataType}></button>
        </div>
    )
}