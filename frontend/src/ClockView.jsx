/* eslint-disable react/prop-types */
import { formatTime } from "./utils";
import { useState, useEffect } from "react";

const dates = ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"];

export default function ClockView({ isFullscreen, onToggleFullscreen }) {
    
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
            <button
                className={`fullscreen-button ${isFullscreen ? "is-fullscreen" : ""}`}
                onClick={onToggleFullscreen}
                type="button"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
                <span className="fullscreen-icon" aria-hidden="true">
                    <b></b>
                    <b></b>
                    <b></b>
                    <b></b>
                </span>
            </button>
            <h3>{dates[time.getDay()]}, {formattedDate}</h3>
            <h1>klo {formatTime(time)}</h1>
        </div>
    );
}
