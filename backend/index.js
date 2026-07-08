import express from 'express';
import dotenv from 'dotenv';
import { getBusDepartures } from './apis/bus.js';
import { getWeather } from './apis/weather.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let busDepartures = await getBusDepartures();
let weatherData = await getWeather();
console.log("WEATHER DATA ", weatherData);

setInterval(async () => {
    busDepartures = await getBusDepartures();
}, 30 * 1000);

setInterval(async () => {
    weatherData = await getWeather();
}, 30 * 60 * 1000);

app.get('/api/update', async (req, res) => {
    res.status(200).send({busDepartures, weatherData});
});

app.use(express.static('dist'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
