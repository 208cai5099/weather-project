export async function queryWeatherDB(dayInterval: number, location: string, timeZone: string) {

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
    const endpoint = import.meta.env.VITE_WEATHER_DB_ENDPOINT
    const queryParams = new URLSearchParams()
    for (const date of dateInterval) {
        queryParams.append("dates", date)
        queryParams.append("locations", location)
    }

    try {

        const res = await fetch(
            `${endpoint}?${queryParams.toString()}`,
            {
                method: "GET"            
            }
        )

        const resJSON = await res.json()

        return resJSON
        
    } catch (error) {
        console.log(error)
    }

}