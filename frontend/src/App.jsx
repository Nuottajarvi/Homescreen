import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import BusView from './BusView';
import WeatherView from './WeatherView';
import ClockView from './ClockView';

function App() {
  const [buses, setBuses] = useState([]);
  const [weather, setWeather] = useState({});

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

  return (
    <div className="container">
      <div>
        <BusView buses={buses} />
      </div>
      <div style={{marginLeft: "5em"}}>
        <ClockView/>
        <WeatherView weather={weather} />
      </div>
    </div>
  )
}

export default App
