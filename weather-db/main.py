from pydantic import BaseModel
from typing import Literal, Dict, List, Union, Annotated
from fastapi import FastAPI, Query as FastAPIQuery

class ForecastEntry(BaseModel):
    date: str
    dayOfWeek: Literal["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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

@app.get("/querydb/")
async def get_forecasts(dates: Annotated[List[str] | None, FastAPIQuery()] = None):
    pass

@app.put("/load/")
async def load_forecasts(new_forecasts: List[ForecastEntry]):
    pass