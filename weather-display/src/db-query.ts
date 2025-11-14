import dotenv from "dotenv"

dotenv.config()

export async function queryWeatherDB(dayInterval: number = 5, location: string = "New York", timeZone: string = "America/New_York") {

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: timeZone
    }
    const dateFormatter = new Intl.DateTimeFormat("en-CA", dateFormatOptions)

    const currentDate = new Date()
    const dateInterval: string[] = []
    for (let i = 0; i < dayInterval + 1; i++) {
        const targetDate = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000)
        dateInterval.push(dateFormatter.format(targetDate))
    }

    // append the date and location parameters to the database endpoint
    const endpoint = process.env.WEATHER_DB_ENDPOINT as string
    const queryParams = new URLSearchParams()
    for (const date of dateInterval) {
        queryParams.append("dates", date)
        queryParams.append("locations", location)
    }

    console.log(`${endpoint}?${queryParams.toString()}`)

    try {

        const res = await fetch(
            `${endpoint}?${queryParams.toString()}`,
            {
                method: "GET"            
            }
        )

        const resJSON = await res.json()

        console.log(resJSON)
        
    } catch (error) {
        console.log(error)
    }

}

await queryWeatherDB()