import Chart, { type ChartConfiguration, type ChartData, type ChartOptions } from 'chart.js/auto'
import { useRef, useEffect } from 'react'
import type { SingleChartData } from './types'

const TEMPERATURE_BAR_COLOR = "#F4991A"
const PRECIPITATION_BAR_COLOR = "#3396D3"
const WIND_SPEED_BAR_COLOR = "#67C090"
const CHART_TEXT_COLOR = "#253546"

interface WeatherChartProps {
    selectedChartData: SingleChartData
}

export function WeatherChart({selectedChartData} : WeatherChartProps) {

    const chartRef = useRef<Chart>(null)

    const getColor = (unit: "°F" | "%" | "mph") => {
        if (unit === "°F") {
            return TEMPERATURE_BAR_COLOR
        } else if (unit === "%") {
            return PRECIPITATION_BAR_COLOR
        } else {
            return WIND_SPEED_BAR_COLOR
        }
    }

    useEffect(() => {

        // remove any previous chart instances from the canvas
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        const graphCanvas = document.getElementById("weather-chart-canvas") as HTMLCanvasElement
        if (graphCanvas) {

            const graphData: ChartData<"bar"> = {
                labels: selectedChartData["xValues"],
                datasets: [
                    {
                        label: selectedChartData["label"],
                        data: selectedChartData["yValues"],
                        backgroundColor: getColor(selectedChartData["unit"])
                    }
                ]
            }
            
            const graphOptions: ChartOptions<"bar"> = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const unit = selectedChartData["unit"]
                                return `${tooltipItem.parsed.y?.toString()} ${unit}`
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: CHART_TEXT_COLOR,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        title: {
                            text: selectedChartData["label"],
                            display: true,
                            color: CHART_TEXT_COLOR,
                            font: {
                                size: 15
                            }
                        },
                        ticks: {
                            color: CHART_TEXT_COLOR
                        }
                    }
                }
            }

            const graphConfig: ChartConfiguration<"bar"> = {
                type: "bar",
                data: graphData,
                options: graphOptions
            }

            const chartInstance = new Chart(
                graphCanvas,
                graphConfig
            )

            chartRef.current = chartInstance

        }

        // in case of unmounting, remove any old chart
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }


    }, [selectedChartData])


    return (
        <div className="weather-chart">
            <canvas id="weather-chart-canvas" />
        </div>
    )

}