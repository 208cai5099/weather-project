import type { UpdateTimestamp } from "./types"

interface UpdateNoticeProps {
    updateTime: UpdateTimestamp
}

export function UpdateTimestamp({updateTime}: UpdateNoticeProps) {
    return (
        <div className="update-notice">
            <p>
                {`Last updated at ${updateTime.hour}:${updateTime.minute >= 10 ? updateTime.minute : "0" + updateTime.minute} ${updateTime.dayOrNight} (${updateTime.month}/${updateTime.day})`}
            </p>
        </div>
    )
}