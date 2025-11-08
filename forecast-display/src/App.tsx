import { queryWeatherForecast } from './data-processing/api-query'
import { extractWeatherDataValue, filterDates, findHighLowTemps } from './data-processing/data-wrangling'
import { fiveDayWeatherForecast, todayWeatherForecast, currentWeather, updateTime } from './components/test-data'
import { WeatherCard } from './components/weather-card'
import './App.css'
import { CurrentWeather } from './components/current-weather'
import { WeatherGraph } from './components/weather-graph'
import { UpdateTimestamp } from './components/update-timestamp'

function App() {

  return (
    <>
    <div className='entire-display'>
      <UpdateTimestamp updateTime={updateTime}/>
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

    </>


  )
}

export default App
