import sqlite3
import json
import os

WEATHER_DB_SCHEMA = "weather_db_schema.json"
WEATHER_DB_NAME = "weather.db"
WEATHER_DB_HOURLY_TABLES = ["hourly_temperature", "hourly_precipitation", "hourly_wind_speed"]

def create_table(db_cursor, table_name, columns):
    
    column_specs = []
    for column_name, constraints in columns.items():
        column_specs.append(f"\n{column_name} {constraints}")
    column_specs = ",".join(column_specs)

    query = f"CREATE TABLE IF NOT EXISTS {table_name} ({column_specs});"
    db_cursor.execute(query)

def db_setup(db_name, schema_file):

    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    with open(schema_file, "r") as file:
        all_schema = json.load(file)

        for table_name, columns in all_schema.items():
            create_table(db_cur, table_name, columns)
    
    db_con.commit()
    db_con.close()

if not os.path.isfile(WEATHER_DB_NAME):
    db_setup(WEATHER_DB_NAME, WEATHER_DB_SCHEMA)


def delete_table(db_name, table_name):
    
    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()
    db_cur.execute(f"DROP TABLE IF EXISTS {table_name}")
    db_con.commit()
    db_con.close()

def update_forecast(new_forecast):
    pass

def insert_forecast(db_name, new_forecast):

    date = new_forecast["date"]
    day_of_week = new_forecast["dayOfWeek"]
    location = new_forecast["location"]
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

    summary_query = (
        "INSERT INTO forecast_summary (location, date, day_of_week, low_temp, high_temp, "
        "short_daytime_forecast, detailed_daytime_forecast, short_nighttime_forecast, detailed_nighttime_forecast)\n"
        f"VALUES ('{location}', '{date}', '{day_of_week}', {low_temp}, {high_temp}, '{short_daytime_forecast}', '{detailed_daytime_forecast}', '{short_nighttime_forecast}', '{detailed_nighttime_forecast}');"
    )
    db_cur.execute(summary_query)

    temp_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_temp.items()]
    db_cur.execute(f"INSERT INTO hourly_temperature (location, date, time, value)\nVALUES {",\n".join(temp_data)};")

    precipitation_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_precipitation.items()]
    db_cur.execute(f"INSERT INTO hourly_precipitation (location, date, time, value)\nVALUES {",\n".join(precipitation_data)};")

    wind_speed_data = [f"('{location}', '{date}', '{time}', {value})" for time, value in hourly_wind_speed.items()]
    db_cur.execute(f"INSERT INTO hourly_wind_speed (location, date, time, value)\nVALUES {",\n".join(wind_speed_data)};")

    db_con.commit()
    db_con.close()


def forecast_entry_already_exists(db_name, date, location):

    db_con = sqlite3.connect(db_name)
    db_cur = db_con.cursor()

    query = (
        f"SELECT date, location\n"
        f"FROM forecast_summary\n"
        f"WHERE date = '{date}' AND location = '{location}'"
    )

    res = db_cur.execute(query)

    output = False if res.fetchone() is None else True

    db_con.close()

    print(output)
    return output

def load_new_forecast(new_forecast):

    date = new_forecast["date"]
    location = new_forecast["location"]

    if forecast_entry_already_exists(date, location):
        update_forecast(new_forecast)
    else:
        insert_forecast(new_forecast)

def query_forecast(db_name, date, location):

    if forecast_entry_already_exists(db_name, date, location):

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

        for hourly_table in ["temperature", "precipitation", "wind_speed"]:

            table_name = "hourly_" + hourly_table

            forecast_output[table_name] = {}

            hourly_query = (
                f"SELECT time, value\n"
                f"FROM {table_name}\n"
                f"WHERE date='{date}' AND location='{location}'"
            )

            hourly_data = db_cur.execute(hourly_query)
            hourly_data = hourly_data.fetchall()

            for hour, value in hourly_data:
                forecast_output[table_name][hour] = value

        db_con.commit()
        db_con.close()

        return forecast_output

# test = {
#         "location": "New York",
#         "date": "2025-11-12",
#         "dayOfWeek": "Wednesday",
#         "hourlyTemp": {
#             "00:00": 37,
#             "01:00": 36,
#             "02:00": 36,
#             "03:00": 35,
#             "04:00": 36,
#             "05:00": 36,
#             "06:00": 36,
#             "07:00": 37,
#             "08:00": 40,
#             "09:00": 43,
#             "10:00": 46,
#             "11:00": 48,
#             "12:00": 50,
#             "13:00": 50,
#             "14:00": 51,
#             "15:00": 50,
#             "16:00": 50,
#             "17:00": 50,
#             "18:00": 49,
#             "19:00": 49,
#             "20:00": 48,
#             "21:00": 48,
#             "22:00": 47,
#             "23:00": 46
#         },
#         "hourlyPrecipitation": {
#             "00:00": 1,
#             "01:00": 10,
#             "02:00": 10,
#             "03:00": 10,
#             "04:00": 10,
#             "05:00": 10,
#             "06:00": 10,
#             "07:00": 7,
#             "08:00": 7,
#             "09:00": 7,
#             "10:00": 7,
#             "11:00": 7,
#             "12:00": 7,
#             "13:00": 7,
#             "14:00": 7,
#             "15:00": 7,
#             "16:00": 7,
#             "17:00": 7,
#             "18:00": 7,
#             "19:00": 1,
#             "20:00": 1,
#             "21:00": 1,
#             "22:00": 1,
#             "23:00": 1
#         },
#         "hourlyWindSpeed": {
#             "00:00": 15,
#             "01:00": 14,
#             "02:00": 14,
#             "03:00": 13,
#             "04:00": 13,
#             "05:00": 12,
#             "06:00": 12,
#             "07:00": 12,
#             "08:00": 13,
#             "09:00": 14,
#             "10:00": 15,
#             "11:00": 15,
#             "12:00": 16,
#             "13:00": 16,
#             "14:00": 15,
#             "15:00": 15,
#             "16:00": 15,
#             "17:00": 14,
#             "18:00": 14,
#             "19:00": 14,
#             "20:00": 13,
#             "21:00": 13,
#             "22:00": 14,
#             "23:00": 13
#         },
#         "lowTemp": 35,
#         "highTemp": 51,
#         "shortDaytimeForecast": "Partly Sunny",
#         "detailedDaytimeForecast": "Partly sunny, with a high near 51. Southwest wind 12 to 16 mph, with gusts as high as 26 mph.",
#         "shortNighttimeForecast": "Partly Cloudy",
#         "detailedNighttimeForecast": "Partly cloudy, with a low around 40. West wind around 14 mph."
#     }

# insert_forecast(WEATHER_DB_NAME, test)
# print(query_forecast(WEATHER_DB_NAME, "2025-11-12", "New York"))

# con = sqlite3.connect(WEATHER_DB_NAME)
# cur = con.cursor()

# res = cur.execute("SELECT * FROM forecast_summary")
# print(res.fetchall())

# con.close()