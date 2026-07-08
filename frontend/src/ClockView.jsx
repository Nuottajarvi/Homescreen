import { formatTime } from "./utils";
import { useState, useEffect } from "react";

const dates = ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"];

export default function ClockView() {
    
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    const formattedDate = `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()}`;

    return (
        <div className="clock">
            <h3>{dates[time.getDay()]}, {formattedDate}</h3>
            <h1>klo {formatTime(time)}</h1>
        </div>
    );
}