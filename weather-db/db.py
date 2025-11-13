import sqlite3
import json

WEATHER_DB_SCHEMA = "weather_db_schema.json"
WEATHER_DB_NAME = "weather.db"
WEATHER_DB_HOURLY_TABLES = ["hourly_temperature", "hourly_precipitation", "hourly_wind_speed"]


def create_table(db_cursor, table_name, columns):
    """
    Creates a table with the specified column specifications.

    Args:
        db_cursor (Cursor): Cursor for the SQLite database.
        table_name (str): Name of the table.
        columns (dict): A dict that maps each column name to its data type and constraints.

    Returns:
        None:       
    """
    
    column_specs = []
    for column_name, constraints in columns.items():
        column_specs.append(f"\n{column_name} {constraints}")
    column_specs = ",".join(column_specs)

    query = f"CREATE TABLE IF NOT EXISTS {table_name} ({column_specs});"
    db_cursor.execute(query)


def db_setup(schema_file_path, db_name=WEATHER_DB_NAME):
    """
    Creates a SQLite database using the provided JSON schema file.

    Args:
        schema_file_path (str): Path to the JSON file containing the table schemas.
        db_name (str): Name of the database.
    """

    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    with open(schema_file_path, "r") as file:
        all_schema = json.load(file)

        for table_name, columns in all_schema.items():
            create_table(db_cur, table_name, columns)
    
    db_con.commit()
    db_con.close()


def delete_table(table_name, db_name=WEATHER_DB_NAME):
    """
    Deletes a table from the database.

    Args:
        table_name (str): Name of the table to be deleted.
        db_name (str): Name of the database.
    """
    
    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()
    db_cur.execute(f"DROP TABLE IF EXISTS {table_name};")
    db_con.commit()
    db_con.close()


def update_forecast(new_forecast, db_name=WEATHER_DB_NAME):
    """
    Updates the database with the details from the new forecast.

    Args:
        new_forecast (dict): A JSON-like object that contains new details of the forecast for a specific day.
        db_name (str): Name of the database.
    """

    date = new_forecast["date"]
    day_of_week = new_forecast["dayOfWeek"]
    location = new_forecast["location"]
    low_temp = new_forecast["lowTemp"]
    high_temp = new_forecast["highTemp"]
    short_daytime_forecast = new_forecast["shortDaytimeForecast"]
    detailed_daytime_forecast = new_forecast["detailedDaytimeForecast"]
    short_nighttime_forecast = new_forecast["shortNighttimeForecast"]
    detailed_nighttime_forecast = new_forecast["detailedNighttimeForecast"]
    
    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    ## update the high-level forecast information
    summary_query = (
        "UPDATE forecast_summary\n"
        f"SET location='{location}', date='{date}', day_of_week='{day_of_week}', low_temp={low_temp}, high_temp={high_temp}, "
        f"short_daytime_forecast='{short_daytime_forecast}', detailed_daytime_forecast='{detailed_daytime_forecast}', "
        f"short_nighttime_forecast='{short_nighttime_forecast}', detailed_nighttime_forecast='{detailed_nighttime_forecast}'\n"
        f"WHERE location='{location}' AND date='{date}';"
    )

    db_cur.execute(summary_query)

    ## update the hourly forecast, temperature, precipitation, and wind speed data
    for hourly_type in ["hourlyForecast", "hourlyTemp", "hourlyPrecipitation", "hourlyWindSpeed"]:

        hourly_data = new_forecast[hourly_type]

        if hourly_type == "hourlyForecast":

            table_name = "hourly_forecast"

            for time, forecast in hourly_data.items():

                query = (
                    f"UPDATE {table_name}\n"
                    f"SET forecast='{forecast}'\n"
                    f"WHERE location='{location}' AND date='{date}' AND time='{time}'"
                )

                db_cur.execute(query)

        else:

            if hourly_type == "hourlyTemp":
                table_name = "hourly_temperature"
            elif hourly_type == "hourlyPrecipitation":
                table_name = "hourly_precipitation"
            else:
                table_name = "hourly_wind_speed"

            for time, value in hourly_data.items():
                
                query = (
                    f"UPDATE {table_name}\n"
                    f"SET value={value}\n"
                    f"WHERE location='{location}' AND date='{date}' AND time='{time}'"
                )

                db_cur.execute(query)

    db_con.commit()
    db_con.close()


def insert_forecast(new_forecast, db_name=WEATHER_DB_NAME):
    """
    Creates a new entry in the database's tables for the new forecast.

    Args:
        new_forecast (dict): A JSON-like object containing forecast details for a specific day.
        db_name (str): Name of the database.
    """

    date = new_forecast["date"]
    day_of_week = new_forecast["dayOfWeek"]
    location = new_forecast["location"]
    hourly_forecast = new_forecast["hourlyForecast"]
    hourly_temp = new_forecast["hourlyTemp"]
    hourly_precipitation = new_forecast["hourlyPrecipitation"]
    hourly_wind_speed = new_forecast["hourlyWindSpeed"]
    low_temp = new_forecast["lowTemp"]
    high_temp = new_forecast["highTemp"]
    short_daytime_forecast = new_forecast["shortDaytimeForecast"]
    detailed_daytime_forecast = new_forecast["detailedDaytimeForecast"]
    short_nighttime_forecast = new_forecast["shortNighttimeForecast"]
    detailed_nighttime_forecast = new_forecast["detailedNighttimeForecast"]
    
    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    ## insert an entry of high-level forecast info
    summary_query = (
        "INSERT INTO forecast_summary (location, date, day_of_week, low_temp, high_temp, "
        "short_daytime_forecast, detailed_daytime_forecast, short_nighttime_forecast, detailed_nighttime_forecast)\n"
        f"VALUES ('{location}', '{date}', '{day_of_week}', {low_temp}, {high_temp}, '{short_daytime_forecast}', '{detailed_daytime_forecast}', '{short_nighttime_forecast}', '{detailed_nighttime_forecast}');"
    )
    db_cur.execute(summary_query)

    ## insert the hourly forecast predictions
    forecast_data = [f"('{location}', '{date}', '{time}', '{forecast}')" for time, forecast in hourly_forecast.items()]
    db_cur.execute(f"INSERT INTO hourly_forecast (location, date, time, forecast)\nVALUES {",\n".join(forecast_data)};")

    ## insert the hourly temperature forecast readings
    temp_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_temp.items()]
    db_cur.execute(f"INSERT INTO hourly_temperature (location, date, time, value)\nVALUES {",\n".join(temp_data)};")

    ## insert the hourly precipitation forecast readings
    precipitation_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_precipitation.items()]
    db_cur.execute(f"INSERT INTO hourly_precipitation (location, date, time, value)\nVALUES {",\n".join(precipitation_data)};")

    ## insert the hourly wind speed forecast readings
    wind_speed_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_wind_speed.items()]
    db_cur.execute(f"INSERT INTO hourly_wind_speed (location, date, time, value)\nVALUES {",\n".join(wind_speed_data)};")

    db_con.commit()
    db_con.close()


def forecast_entry_already_exists(date, location, db_name=WEATHER_DB_NAME):
    """
    Checks whether a forecast is available for the given date and location.

    Args:
        date (str): Date of forecast.
        location (str): Location of forecast.
        db_name (str): Name of the database.
    """

    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    query = (
        f"SELECT date, location\n"
        f"FROM forecast_summary\n"
        f"WHERE date = '{date}' AND location = '{location}';"
    )

    print(query)

    res = db_cur.execute(query)

    output = False if res.fetchone() is None else True

    db_con.close()

    return output


def add_new_forecast(new_forecast, db_name=WEATHER_DB_NAME):
    """
    Adds the forecast info to the database.

    Args:
        new_forecast (dict): A JSON-like object containing forecast details for a specific day.
        db_name (str): Name of the database.
    """

    date = new_forecast["date"]
    location = new_forecast["location"]

    if forecast_entry_already_exists(date, location, db_name):
        update_forecast(new_forecast, db_name)
    else:
        insert_forecast(new_forecast, db_name)


def query_forecast(date, location, db_name=WEATHER_DB_NAME):
    """
    Queries the database for forecast information from a specific date and location.

    Args:
        date (str): Date of the forecast.
        location (str): Location of the forecast.
        db_name (str): Name of the database.
    """

    if forecast_entry_already_exists(date, location, db_name):

        forecast_output = {}

        db_con = sqlite3.connect(db_name)
        db_cur = db_con.cursor()

        summary_query = (
            "SELECT day_of_week, low_temp, high_temp, short_daytime_forecast, detailed_daytime_forecast, "
            "short_nighttime_forecast, detailed_nighttime_forecast\n"
            "FROM forecast_summary\n"
            f"WHERE date='{date}' AND location='{location}'"
        )
        
        summary = db_cur.execute(summary_query)
        summary = summary.fetchone()
        forecast_output["location"] = location
        forecast_output["date"] = date
        forecast_output["day_of_week"] = summary[0]
        forecast_output["low_temp"] = summary[1]
        forecast_output["high_temp"] = summary[2]
        forecast_output["short_daytime_forecast"] = summary[3]
        forecast_output["detailed_daytime_forecast"] = summary[4]
        forecast_output["short_nighttime_forecast"] = summary[5]
        forecast_output["detailed_nighttime_forecast"] = summary[6]

        for hourly_table in ["forecast", "temperature", "precipitation", "wind_speed"]:

            table_name = "hourly_" + hourly_table

            forecast_output[table_name] = {}

            if hourly_table == "forecast":
                hourly_query = (
                    f"SELECT time, forecast\n"
                    f"FROM {table_name}\n"
                    f"WHERE date='{date}' AND location='{location}'"
                )                
            else:
                hourly_query = (
                    f"SELECT time, value\n"
                    f"FROM {table_name}\n"
                    f"WHERE date='{date}' AND location='{location}'"
                )

            hourly_data = db_cur.execute(hourly_query)
            hourly_data = hourly_data.fetchall()

            for hour, data_point in hourly_data:
                forecast_output[table_name][hour] = data_point

        db_con.commit()
        db_con.close()

        return forecast_output