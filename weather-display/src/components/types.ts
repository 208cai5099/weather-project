export interface UpdateTimestamp {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    dayOrNight: "AM" | "PM"
}

export type chartDataType = "temperature" | "precipitation" | "wind-speed"

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

export interface WeatherChartData {
    label: "Temperature (°F)" | "Precipitation %" | "Wind Speed (mph)",
    x_values: string[],
    y_values: number[],
    unit: "°F" | "%" | "mph"
}

export interface ForecastEntry {
  location: string,
  date: string,
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  hourlyForecast: Record<string, string>,
  hourlyTemp: Record<string, number | null>,
  hourlyPrecipitation: Record<string, number | null>,
  hourlyWindSpeed: Record<string, number | null>,
  lowTemp: number,
  highTemp: number,
  shortDaytimeForecast: string,
  detailedDaytimeForecast: string,
  shortNighttimeForecast: string,
  detailedNighttimeForecast: string,
  daytimeWeatherDescriptor: string,
  nighttimeWeatherDescriptor: string
}

