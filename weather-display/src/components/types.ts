export type chartDataType = "temperature" | "precipitation" | "windSpeed"

export interface CurrentWeather {
    location: string,
    temperature: number | null,
    precipitationProb: number | null,
    windSpeed: number | null,
    forecast: string,
    svgPath: string,
    needUmbrella: string | null
}

export interface WeatherForecast {
    date: string,
    dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
    lowTemp: number | null,
    highTemp: number | null,
    daytimeForecast: {
        forecast: string,
        svgPath: string,
        needUmbrella: string | null
    },
    nighttimeForecast: {
        forecast: string,
        svgPath: string,
        needUmbrella: string | null
    }
}

export interface SingleChartData {
    label: "Temperature (°F)" | "Precipitation %" | "Wind Speed (mph)",
    xValues: string[],
    yValues: (number | null)[],
    unit: "°F" | "%" | "mph"
}

export interface WeatherChartData {
    temperature: {
        label: "Temperature (°F)",
        xValues: string[],
        yValues: (number | null)[],
        unit: "°F"
    },
    precipitation: {
        label: "Precipitation %",
        xValues: string[],
        yValues: (number | null)[],
        unit: "%"
    },
    windSpeed: {
        label: "Wind Speed (mph)",
        xValues: string[],
        yValues: (number | null)[],
        unit: "mph"
    }
}

export interface ForecastEntry {
  location: string,
  date: string,
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  hourlyForecast: Record<string, string>,
  hourlyTemperature: Record<string, number | null>,
  hourlyPrecipitation: Record<string, number | null>,
  hourlyWindSpeed: Record<string, number | null>,
  lowTemp: number,
  highTemp: number,
  shortDaytimeForecast: string,
  detailedDaytimeForecast: string,
  daytimeWeatherDescriptor: string,
  shortNighttimeForecast: string,
  detailedNighttimeForecast: string,
  nighttimeWeatherDescriptor: string
}

