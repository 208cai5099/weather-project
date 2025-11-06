import type { WeatherForecast } from "./types";

interface WeatherCardProps {
    forecast: WeatherForecast
}

export function WeatherCard({forecast}: WeatherCardProps) {

    return (
        <div className="weather-card">
            <p className="weather-card-day">
                {forecast["dayOfWeek"]}<br/>{`(${forecast["date"]})`}
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
    )

}