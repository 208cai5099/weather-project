import type { CurrentWeather, WeatherForecast } from "./types"

interface CurrentWeatherCardProps {
    forecast: WeatherForecast | null
    currentWeather: CurrentWeather | null
}

export function CurrentWeatherInfo({forecast, currentWeather}: CurrentWeatherCardProps) {

    if (forecast && currentWeather) {

        return (
            
            <div className="today-forecast-current-weather">
                <div className="today-forecast">
                    <p>
                        {forecast["dayOfWeek"]} {`(${forecast["date"]})`}
                    </p>

                    <div className="weather-picture">
                        <img src={currentWeather["svgPath"]} className="forecast-icon" alt="weather forecast icon" />
                        {currentWeather["needUmbrella"] ? <img src={currentWeather["needUmbrella"]} className="umbrella-icon" alt="umbrella icon"/> : <div />}
                    </div>
                    
                    <p>
                        {`${forecast["lowTemp"]} - ${forecast["highTemp"]}°F`}
                    </p>
                    
                    <p>
                        {currentWeather["forecast"]}
                    </p>
                </div>

                <div className="current-weather">

                    <p className="current-weather-location">
                        {`${currentWeather["location"]}`}<br/>
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
}