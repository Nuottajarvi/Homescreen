import dotenv from 'dotenv';
import axios from 'axios';
import { formatTime } from '../util.js';
dotenv.config();

const dayNames = ["su", "ma", "ti", "ke", "to", "pe", "la"];
const requiredEnvVars = ["WEATHER_LAT", "WEATHER_LON", "WEATHER_API_KEY", "USER_AGENT"];

function env(name) {
    const value = process.env[name]?.trim().replace(/^['"]|['"]$/g, "");

    if(!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

function getWeatherConfig() {
    requiredEnvVars.forEach(env);

    return {
        lat: env("WEATHER_LAT"),
        lon: env("WEATHER_LON"),
        apiKey: env("WEATHER_API_KEY"),
        userAgent: env("USER_AGENT"),
    };
}

export async function getWeather() {
    try {
        const { lat, lon, apiKey, userAgent } = getWeatherConfig();
        const openWeatherUrl = new URL("https://api.openweathermap.org/data/3.0/onecall");
        openWeatherUrl.searchParams.set("lat", lat);
        openWeatherUrl.searchParams.set("lon", lon);
        openWeatherUrl.searchParams.set("exclude", "minutely");
        openWeatherUrl.searchParams.set("appid", apiKey);

        const norwayWeatherUrl = new URL("https://api.met.no/weatherapi/locationforecast/2.0/compact");
        norwayWeatherUrl.searchParams.set("lat", lat);
        norwayWeatherUrl.searchParams.set("lon", lon);

        const openWeatherData = await axios.get(openWeatherUrl.toString());

        const weatherDataNorway = await axios.get(norwayWeatherUrl.toString(),
        {
            headers: {
                "User-Agent": userAgent
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
        const status = error.response?.status;
        const body = error.response?.data;
        const message = status ? `Weather update failed with HTTP ${status}` : error.message;
        console.error(message, body ?? "");
        return null;
    }
}
