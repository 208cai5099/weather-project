import { fiveDayWeatherForecast, todayWeatherForecast, currentWeather } from './test-data'
import { WeatherCard } from './weather-card'
import '../App.css'
import { CurrentWeather } from './current-weather'
import { WeatherGraph } from './weather-graph'
import { StatusBar } from './status-bar'
import { queryWeatherDB } from './utils'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const DEFAULT_DAYS = 5
const DEFAULT_LOCATION = "New York"
const DEFAULT_TIMEZONE = "America/New_York"

export function Dashboard() {

    const { isFetching, isError, isSuccess, data, error } = useQuery({
        queryKey: ["get", {days: DEFAULT_DAYS, location: DEFAULT_LOCATION, timeZone: DEFAULT_TIMEZONE}],
        queryFn: async () => { 
            const forecastData = await queryWeatherDB(DEFAULT_DAYS, DEFAULT_LOCATION, DEFAULT_TIMEZONE)
            if (!forecastData) {
                throw new Error("Failed to fetch forecast data from database.")
            }

            console.log(forecastData)
            return forecastData
        },
        staleTime: 30 * 60 * 1000,
        gcTime: 45 * 60 * 1000
    })

    if (error) {
        console.log(error)
    }

    if (data) {
        console.log(data)
    }

    return (
        <div className='entire-display'>
            <StatusBar isFetching={isFetching} isError={isError} isSuccess={isSuccess} timeZone={DEFAULT_TIMEZONE}/>
            <div className='top-row'>
                <CurrentWeather forecast={todayWeatherForecast} currentWeather={currentWeather}/>
                <WeatherGraph />
            </div>
            <div className="five-day-forecast-row">
            {
                fiveDayWeatherForecast.map((forecastObject, idx) => <WeatherCard forecast={forecastObject} key={`weather-card-${idx}`}/>)
            }
            </div>
        </div>
    )
}