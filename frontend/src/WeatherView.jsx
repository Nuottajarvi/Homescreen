import sunrise from './assets/icons/weather/Sunrise.svg';

import { formatTime } from './utils';

export default function WeatherView({ weather }) {

    if(!weather || Object.keys(weather).length === 0) {
        return;
    } else {
        console.log("WEATHER ", weather);
    }

    return (
        <div>
            <div>
                <div className="weather-view">
                    {
                        weather.weatherData.map(weather => {
                            console.log("WEATHER WEATHER ", weather.weather);
                            return (
                                <div key={weather.time} className="icon-text weather-box">
                                    <p>{weather.time}</p>
                                    <img src={`./assets/icons/weather/${weather.weather}.png`} className="icon"/>
                                    <p>{weather.temperature?.toFixed(1)}°C</p>
                                </div>
                            );
                        })
                    }

                </div>
                <div className="icon-text">
                    <img src={sunrise} className="icon" style={{height: "80px"}}/>
                    <p>{formatTime(weather.sunrise)} - {formatTime(weather.sunset)}</p>
                </div>
            </div>
        </div>
    );
}