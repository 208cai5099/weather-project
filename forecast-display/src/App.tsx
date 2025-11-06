import { useState } from 'react'
import { queryWeatherForecast } from './data-processing/api-query'
import { extractWeatherDataValue, filterDates, findHighLowTemps } from './data-processing/data-wrangling'
import { fiveDayWeatherForecast, todayWeatherForecast, currentWeather } from './components/test-data'
import { WeatherCard } from './components/weather-card'
import './App.css'
import { CurrentWeather } from './components/current-weather'

function App() {

  return (
    <>
    <div className='entire-display'>
      <div className='top-row'>
        <CurrentWeather forecast={todayWeatherForecast} currentWeather={currentWeather}/>
        <CurrentWeather forecast={todayWeatherForecast} currentWeather={currentWeather}/>
      </div>
      <div className="five-day-forecast-row">
        {
          fiveDayWeatherForecast.map((forecastObject, idx) => <WeatherCard forecast={forecastObject} key={`weather-card-${idx}`}/>)
        }
      </div>
    </div>

    </>


  )
}

export default App
