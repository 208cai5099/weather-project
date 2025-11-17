from pydantic import BaseModel
from typing import Literal, Dict, List, Union, Annotated
from fastapi import FastAPI, Query
import os
from db import query_forecast, add_new_forecast, db_setup, WEATHER_DB_NAME, WEATHER_DB_SCHEMA
from fastapi.middleware.cors import CORSMiddleware


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
    daytimeWeatherDescriptor: str
    nighttimeWeatherDescriptor: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all headers
)

@app.get("/query/")
async def get_forecasts(dates: Annotated[List[str] | None, Query()] = None, locations: Annotated[List[str] | None, Query()] = None):

    # try:

        output_forecasts = []
        query_inputs = zip(dates, locations)
        
        for date, location in query_inputs:

            forecast = query_forecast(date, location)
            output_forecasts.append(forecast)
        
        return output_forecasts
    
    # except:
    #     return {"message": "failure"}


@app.put("/load/")
async def load_forecasts(new_forecasts: List[ForecastEntry]):
    
    try:
        success_count = 0
        for forecast in new_forecasts:
            add_new_forecast(dict(forecast))
            success_count += 1
        return {"message": f"Successfully saved {success_count} of {len(new_forecasts)} new forecasts"}
    except:
        return {"message": "Internal failure"}