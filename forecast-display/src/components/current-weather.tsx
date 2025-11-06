import type { CurrentWeather, WeatherForecast } from "./types"
import { WeatherCard } from "./weather-card"

interface CurrentWeatherCardProps {
    forecast: WeatherForecast
    currentWeather: CurrentWeather
}

export function CurrentWeather({forecast, currentWeather}: CurrentWeatherCardProps) {

    return (
        <div className="today-forecast-current-weather">
            <div className="today-forecast">
                <p>
                    {forecast["dayOfWeek"]} {`(${forecast["date"]})`}
                </p>

                <div className="weather-picture">
                    <img src={forecast["svgPath"]} className="forecast-icon" alt="weather forecast icon" />
                    {forecast["needUmbrella"] === null ? <div/> : <img src={forecast["needUmbrella"]} className="umbrella-icon" alt="umbrella icon"/>}
                </div>
                
                <p>
                    {`${forecast["lowTemp"]} - ${forecast["highTemp"]}°F`}
                </p>
                
                <p>
                    {forecast["shortForecast"]}
                </p>
            </div>

            <div className="current-weather">

                <p className="current-weather-location">
                    {`${currentWeather["city"]}, ${currentWeather["state"]}`}<br/>
                </p>

                <p className="current-weather-temp">
                    {`${currentWeather["temperature"]}°F`}<br/>
                </p>

                <p>
                    {`Precpitation: ${currentWeather["precipitationProb"]}%`}<br/>
                    {`Wind Speed: ${currentWeather["windSpeed"]} mph`}<br/>
                </p>


            </div>
        </div>
    )
}