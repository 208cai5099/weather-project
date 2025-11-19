import sqlite3

WEATHER_DB_NAME = "weather.db"

db_con = sqlite3.connect(WEATHER_DB_NAME)
db_cur = db_con.cursor()

query_all = "SELECT * FROM hourly_temperature"

res = db_cur.execute(query_all)
rows = res.fetchall()

for r in rows:
    print(r)