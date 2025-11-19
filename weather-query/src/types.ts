export interface WeatherPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number;
  };
  dewpoint?: {
    unitCode: string,
    value: number
  },
  relativeHumidity?: {
    unitCode: string,
    value: number,
  },
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface WeatherForecast {
  "@context": (string | Record<string, string | number>)[];
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: {
      unitCode: string;
      value: number;
    };
    periods: WeatherPeriod[];
  };
}

export interface ForecastEntry {
  location: string,
  date: string,
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  hourlyForecast: Record<string, string>,
  hourlyTemp: Record<string, number>,
  hourlyPrecipitation: Record<string, number>,
  hourlyWindSpeed: Record<string, number>,
  shortDaytimeForecast: string,
  detailedDaytimeForecast: string,
  shortNighttimeForecast: string,
  detailedNighttimeForecast: string,
  daytimeWeatherDescriptor: string,
  nighttimeWeatherDescriptor: string
}

