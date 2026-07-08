import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import BusView from './BusView';
import WeatherView from './WeatherView';
import ClockView from './ClockView';

function App() {
  const [buses, setBuses] = useState([]);
  const [weather, setWeather] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/update");
      setBuses(res.data.busDepartures.map(bus => ({...bus, time: new Date(bus.time), realtime: bus.realtime ? new Date(bus.realtime) : null})));
      setWeather(res.data.weatherData);
    }
    const fetchInterval = setInterval(fetchData, 10000);
    fetchData();

    return () => {
      clearInterval(fetchInterval);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  };

  return (
    <>
      <button
        className="fullscreen-button"
        onClick={toggleFullscreen}
        type="button"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? "X" : "[]"}
      </button>
      <div className="container">
        <div>
          <BusView buses={buses} />
        </div>
        <div className="side-panel">
          <ClockView/>
          <WeatherView weather={weather} />
        </div>
      </div>
    </>
  )
}

export default App
