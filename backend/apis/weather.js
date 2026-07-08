import dotenv from 'dotenv';
import axios from 'axios';
import { formatTime } from '../util.js';
dotenv.config();

const dayNames = ["su", "ma", "ti", "ke", "to", "pe", "la"];

export async function getWeather() {
    try {
        const openWeatherData = await axios.get(`
            https://api.openweathermap.org/data/3.0/onecall?lat=${process.env.WEATHER_LAT}&lon=${process.env.WEATHER_LON}&exclude=minutely&appid=${process.env.WEATHER_API_KEY}
        `);

        const weatherDataNorway = await axios.get(`
            https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${process.env.WEATHER_LAT}&lon=${process.env.WEATHER_LON}
        `,
        {
            headers: {
                "User-Agent": process.env.USER_AGENT
            }
        });
        const data = {};
        const openData = openWeatherData.data;
        const norData = weatherDataNorway.data.properties.timeseries;
        data.sunrise = new Date(openData.current.sunrise * 1000);
        data.sunset = new Date(openData.current.sunset * 1000);

        const currentHour = new Date();
        if(currentHour.getMinutes() > 30) {
            currentHour.setHours(currentHour.getHours() + 1);
        }

        currentHour.setMinutes(0);
        currentHour.setSeconds(0);
        currentHour.setMilliseconds(0);

        const days = [
            new Date(currentHour.getTime() + 24 * 60 * 60 * 1000),
            new Date(currentHour.getTime() + 48 * 60 * 60 * 1000),
            new Date(currentHour.getTime() + 72 * 60 * 60 * 1000)
        ];

        days.forEach((day) => {
            day.setUTCHours(12);
        });

        const times = [
            currentHour,
            new Date(currentHour.getTime() + 3 * 60 * 60 * 1000),
            new Date(currentHour.getTime() + 6 * 60 * 60 * 1000),
            new Date(currentHour.getTime() + 9 * 60 * 60 * 1000),
            ...days
        ];

        const mappedTimes = times.map((time) => {
            return norData.find(d => {
                if(new Date(d.time).getTime() === time.getTime()) {
                    return d;
                } else {
                    return null;
                }
            });
        }).filter(n => !!n);
    
        const weatherData = mappedTimes.map((d, i) => {
            console.log("TIME ", d.time);
            return {
                time: i === 0 ? "nyt" : (i >= 4 ? dayNames[new Date(d.time).getDay()] : formatTime(new Date(d.time))),
                temperature: d.data.instant.details.air_temperature,
                weather: i >= 4 ? d.data.next_6_hours?.summary?.symbol_code : d.data.next_1_hours?.summary?.symbol_code,
                rainFall: i >= 4 ? d.data.next_6_hours?.details?.precipitation_amount : d.data.next_1_hours?.details?.precipitation_amount,
                cloudCover: d.data.instant.details.cloud_area_fraction,
                windSpeed: d.data.instant.details.wind_speed,
            }
        });

        data.weatherData = weatherData;
        return data;


    } catch (error) {
        console.error(error);
    }
}