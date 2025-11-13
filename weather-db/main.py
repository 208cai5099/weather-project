from pydantic import BaseModel
from typing import Literal, Dict, List, Union
from fastapi import FastAPI
import os
from db import query_forecast, add_new_forecast, db_setup, WEATHER_DB_NAME, WEATHER_DB_SCHEMA

if not os.path.isfile(WEATHER_DB_NAME):
    db_setup(WEATHER_DB_SCHEMA, WEATHER_DB_NAME)

class QueryInput(BaseModel):
    location: str
    date: str

class ForecastEntry(BaseModel):
    location: str
    date: str
    dayOfWeek: Literal["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    hourlyForecast: Dict[str, str]
    hourlyTemp: Dict[str, Union[int, None]]
    hourlyPrecipitation: Dict[str, Union[int, None]]
    hourlyWindSpeed: Dict[str, Union[int, None]]
    lowTemp: int
    highTemp: int
    shortDaytimeForecast: str
    detailedDaytimeForecast: str
    shortNighttimeForecast: str
    detailedNighttimeForecast: str

app = FastAPI()

@app.get("/query/")
async def get_forecasts(query_inputs: List[QueryInput]):

    try:
        output_forecasts = []

        for args in query_inputs:
            location = args.location
            date = args.date
            forecast = query_forecast(date, location)
            output_forecasts.append(forecast)
        
        return output_forecasts
    except:
        return {"message": "failure"}


@app.put("/load/")
async def load_forecasts(new_forecasts: List[ForecastEntry]):
    
    # try:
        success_count = 0
        for forecast in new_forecasts:
            add_new_forecast(dict(forecast))
            success_count += 1
        return {"message": f"Successfully saved {success_count} of {len(new_forecasts)} new forecasts"}
    # except:
    #     return {"message": "Internal failure"}