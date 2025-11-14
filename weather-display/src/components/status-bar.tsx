import type { UpdateTimestamp } from "./types"

interface StatusBarProps {
    isFetching: boolean
    isError: boolean
    isSuccess: boolean
    timeZone: string
}

export function StatusBar({isFetching, isError, isSuccess, timeZone}: StatusBarProps) {

    const handleStatusMessage = ({isFetching, isError, isSuccess, timeZone}: StatusBarProps) => {

        if (isError) return "Forecast data could not be fetched."

        if (isFetching) return "Fetching data..."

        if (isSuccess) {
            const dateFormatOptions: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: timeZone
            }
            const dateFormatter = new Intl.DateTimeFormat("en-US", dateFormatOptions)
            const currentDatetime = dateFormatter.format(new Date())
            const [date, time] = currentDatetime.split(", ")

            return `Last updated at ${time} on ${date}`
        }

    }

    return (
        <div className="update-notice">
            <p>
                {handleStatusMessage({isFetching, isError, isSuccess, timeZone})}
            </p>
        </div>
    )
}