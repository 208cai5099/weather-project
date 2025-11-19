import { WeatherCard } from './weather-card'
import { CurrentWeatherInfo } from './current-weather-info'
import { WeatherGraph } from './weather-graph'
import { StatusBar } from './status-bar'
import { queryWeatherDB } from './utils'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { parseWeatherForecast, parseCurrentWeather, parseHourlyData } from './utils'
import { type WeatherChartData, type CurrentWeather, type WeatherForecast, type ForecastEntry } from './types'

const DEFAULT_DAYS = 5
const DEFAULT_LOCATION = "New York"
const DEFAULT_TIMEZONE = "America/New_York"

/**
 * Displays the entire weather dashboard
 */
export function Dashboard() {

    const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null)
    const [todayForecast, setTodayForecast] = useState<WeatherForecast | null>(null)
    const [allChartData, setAllChartData] = useState<WeatherChartData | null>(null)
    const [fiveDayWeatherForecast, setFiveDayWeatherForecast] = useState<WeatherForecast[] | null>(null)

    const { isFetching, isError, isSuccess, data, error } = useQuery({
        queryKey: ["get", {days: DEFAULT_DAYS, location: DEFAULT_LOCATION, timeZone: DEFAULT_TIMEZONE}],
        queryFn: async () => { 
            const forecastData = await queryWeatherDB(DEFAULT_DAYS, DEFAULT_LOCATION, DEFAULT_TIMEZONE)
            if (!forecastData) {
                throw new Error("Failed to fetch forecast data from database.")
            }

            return forecastData as ForecastEntry[]
        },
        refetchInterval: 5 * 60 * 1000
    })

    if (error) {
        console.log(error)
    }

    useEffect(() => {
        
        if (data) {
            setCurrentWeather(parseCurrentWeather(data[0]))
            setTodayForecast(parseWeatherForecast(data[0]))
            setAllChartData(parseHourlyData(data[0]))
            setFiveDayWeatherForecast(data.slice(1, 6).map(((singleDayData) => parseWeatherForecast(singleDayData))))
        }

    }, [data])

    return (
        <div className='entire-display'>
            <StatusBar isFetching={isFetching} isError={isError} isSuccess={isSuccess} timeZone={DEFAULT_TIMEZONE}/>
            <div className='top-row'>
                <CurrentWeatherInfo forecast={todayForecast} currentWeather={currentWeather}/>
                <WeatherGraph allChartData={allChartData} />
            </div>
            <div className="five-day-forecast-row">
            {
                fiveDayWeatherForecast?.map((forecastObject, idx) => <WeatherCard forecast={forecastObject} key={`weather-card-${idx}`}/>)
            }
            </div>
        </div>
    )
}