export function getLocalHourAndMinuteFromISO(time: string) {
    return new Date(time).toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit"
    })
}

export function getLocalDayShort(time: string) {
    return new Date(time).toLocaleString(navigator.language, { weekday: "short" })
}
