import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Get weather for a location
router.get('/:latitude/:longitude', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.params;
    const { units = 'metric' } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          units: units,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    res.json({
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      wind_deg: response.data.wind.deg,
      cloudiness: response.data.clouds.all,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      visibility: response.data.visibility,
      timezone: response.data.timezone,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get weather forecast for a location
router.get('/forecast/:latitude/:longitude', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.params;
    const { units = 'metric' } = req.query;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          units: units,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    res.json({
      forecasts: response.data.list.map((item: any) => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind_speed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rain: item.rain?.['3h'] || 0,
        snow: item.snow?.['3h'] || 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
});

export default router;
