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
    value: number | null;
  };
  dewpoint?: {
    unitCode: string,
    value: number | null
  },
  relativeHumidity?: {
    unitCode: string,
    value: number | null,
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

export interface ForecastArrays {
  timeArray: string[],
  tempArray: (number | null)[],
  windSpeedArray: (number | null)[],
  precipitationProbArray: (number | null)[]
}

export interface ForecastEntry {
  date: string,
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
  forecastArrays: ForecastArrays,
  lowTemp: number,
  highTemp: number,
  shortDaytimeForecast: string,
  detailedDaytimeForecast: string
}

