import type { WeatherForecast } from "./types";

interface WeatherCardProps {
    forecast: WeatherForecast
}

/**
 * A card that displays the date, predicted daytime weather, and low/high temp
 */
export function WeatherCard({forecast}: WeatherCardProps) {

    const daytimeForecast = forecast["daytimeForecast"]

    return (
        <div className="weather-card">
            <p className="weather-card-day">
                {forecast["dayOfWeek"]}<br/>{`(${forecast["date"]})`}
            </p>

            <div className="weather-picture">
                <img src={daytimeForecast["svgPath"]} className="forecast-icon" alt="weather forecast icon" />
                {daytimeForecast["needUmbrella"] === null ? <div/> : <img src={daytimeForecast["needUmbrella"]} className="umbrella-icon" alt="umbrella icon"/>}
            </div>
            
            <p>
                {`${forecast["lowTemp"]} - ${forecast["highTemp"]}°F`}
            </p>
            
            <p>
                {daytimeForecast["forecast"]}
            </p>
        </div>
    )

}