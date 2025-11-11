from tinydb import TinyDB, Query

DB_FILENAME = 'weather-db.json'

def update_hourly_data(old_data, new_data):
    """
    Replaces the previous hourly temp, precipitation, and wind speed data with new values
    """

    ## update the old data values
    for hour, value in new_data.items():
        old_data[hour] = value

    return old_data

def insert_or_update_weather_forecasts(forecasts_list):
    """
    Given a list of new forecasts, load them into the database
    """

    db = TinyDB(DB_FILENAME)
    Forecast = Query()
    for forecast in forecasts_list:
        query_res = db.search(Forecast.date == forecast.date)

        ## if there is no forecast entry for a date, simply add a new entry
        if len(query_res) == 0:
            db.insert(dict(forecast))
        
        ## if an entry is found, update it and preserve data from prior hours
        else:
            curr_entry = dict(query_res[0])
            new_hourly_temp = update_hourly_data(curr_entry["hourlyTemp"], forecast.hourlyTemp)
            new_hourly_precipitation = update_hourly_data(curr_entry["hourlyPrecipitation"], forecast.hourlyPrecipitation)
            new_hourly_wind_speed = update_hourly_data(curr_entry["hourlyWindSpeed"], forecast.hourlyWindSpeed)

            db.update({
                "lowTemp" : forecast.lowTemp, 
                "highTemp": forecast.highTemp,
                "hourlyTemp": new_hourly_temp,
                "hourlyPrecipitation": new_hourly_precipitation,
                "hourlyWindSpeed": new_hourly_wind_speed,
                "shortDaytimeForecast": forecast.shortDaytimeForecast,
                "detailedDaytimeForecast": forecast.detailedDaytimeForecast,
                "shortNighttimeForecast": forecast.shortNighttimeForecast,
                "detailedNighttimeForecast": forecast.detailedNighttimeForecast
                }, Forecast.date == forecast.date)
            

def query_weather_forecasts(dates):
    """
    Returns the weather forecasts of the given dates
    """

    if len(dates) > 0:
        db = TinyDB(DB_FILENAME)

        target_forecasts = []
        Forecast = Query()
        for date in dates:
            target_forecasts.extend(db.search(Forecast.date == date))
        
        return target_forecasts