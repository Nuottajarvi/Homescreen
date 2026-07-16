export const formatTime = (date) => {
    if(!date) {
        return "";
    }

    const parts = new Intl.DateTimeFormat("fi-FI", {
        timeZone: "Europe/Helsinki",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date(date));

    const hour = parts.find(part => part.type === "hour")?.value;
    const minute = parts.find(part => part.type === "minute")?.value;
    return `${hour}:${minute}`;
}
