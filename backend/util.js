export const formatTime = (date) => {
    if(!date) {
        return "";
    }

    if(typeof date !== "object") {
        date = new Date(date);
    }

    return date.getHours() + ":" + date.getMinutes().toString().padStart(2, "0");
}