import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WeatherI {
  name: string;
  main: { temp: number, humidity: number, temp_max:number, temp_min: number };
  weather: { description: string }[];
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherI | null>(null);
  const [city, setCity] = useState('Koblenz');
  const apiKey = 'bb1a11c65e5ab2f55e12e009ec4482a2';

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      console.log(weather)
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
    }
  };

  useEffect(() => {


    fetchData();
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  return (
    <>
      <div>
        <h2>Weather Forecast</h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <input
          type='text'
          name='city'
          value={city}
          onChange={handleCityChange}
        />
        <button type='submit'>Search</button>
      </form>
      {weather ? (
        <div>
          <h3>{weather.name}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Maximum:{weather.main.temp_max}°C   Minimum:{weather.main.temp_min}°C</p>
          <p>Humidity : {weather.main.humidity}%</p>
          <p>Description: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>No data available for the specified city.</p>
      )}
    </>
  );
};

export default Weather;
