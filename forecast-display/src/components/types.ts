export interface CurrentWeather {
    city: string,
    state: string,
    temperature: number | null,
    precipitationProb: number | null,
    windSpeed: number | null
}
export interface WeatherForecast {
    date: string,
    dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
    lowTemp: number | null,
    highTemp: number | null,
    shortForecast: string,
    svgPath: string,
    needUmbrella: string | null
}