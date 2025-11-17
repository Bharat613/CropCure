import React, { useState, useEffect } from "react";
import './WeatherWidget.css'
export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: null,
    humidity: null,
    wind: null,
    pressure: null,
    visibility: null,
    condition: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        () => fetchWeather(28.6139, 77.2090) // fallback to Delhi
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = "e4d2848a1c8c2c8b13e32c5ae463abc6";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.main && data.wind && data.name) {
        setWeather({
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          pressure: data.main.pressure,
          visibility: (data.visibility / 1000).toFixed(1),
          condition: data.weather[0].description,
        });
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  return (
    <div className="weather-widget">
      <h3 className="weather-title">🌤️ Current Weather Details</h3>
     <p className="weather-location">
  🌍Location: {weather.city ? `${weather.city}, ${weather.country}` : "Loading..."}
</p>

      <div className="weather-cards">
        <div className="weather-card"><h4>🌡️ Temp</h4><p>{weather.temp ? `${weather.temp}°C` : "..."}</p></div>
        <div className="weather-card"><h4>💧 Humidity</h4><p>{weather.humidity ? `${weather.humidity}%` : "..."}</p></div>
        <div className="weather-card"><h4>🌬️ Wind</h4><p>{weather.wind ? `${weather.wind} m/s` : "..."}</p></div>
        <div className="weather-card"><h4>🔽 Pressure</h4><p>{weather.pressure ? `${weather.pressure} hPa` : "..."}</p></div>
        <div className="weather-card"><h4>👁️ Visibility</h4><p>{weather.visibility ? `${weather.visibility} km` : "..."}</p></div>
        <div className="weather-card"><h4>🌈 Condition</h4><p>{weather.condition || "..."}</p></div>
      </div>
    </div>
  );
}
