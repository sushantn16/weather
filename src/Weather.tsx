import React, { useState } from 'react';
import axios from 'axios';
import { fetchPlace } from './fetchPlace';
import SearchCity from './SearchCity';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../src/ui/card"


interface WeatherI {
  name: string;
  main: { temp: number, humidity: number, temp_max: number, temp_min: number };
  weather: [{ description: string }];
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherI | null>(null);
  const [icon, setIcon] = useState('');
  const [weatherList, setWeatherList] = useState<WeatherI[] | null>(null)

  const fetchData = async (city: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
      );
      console.log(response.data);
      setWeatherList((prevWeatherList) => {
        const newWeatherData = response.data;
        const isWeatherNameInList = prevWeatherList?.some(
          (weatherData) => weatherData.name === newWeatherData.name
        );
        if (!isWeatherNameInList) {
          const updatedWeatherList =
            Array.isArray(prevWeatherList) && prevWeatherList.length
              ? [newWeatherData, ...prevWeatherList.slice(0, 4)]
              : [newWeatherData];
          return updatedWeatherList;
        }
      
        return prevWeatherList;
      });
      
      setWeather(response.data);
      console.log(await fetchPlace('kob'));
      setIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`)
      console.log(weather)
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
    }
  };

  const handleCardClick = (name:string) =>{
    fetchData(name);
  }


  return (
    <>
      <div className='max-w-screen-xl justify-center m-auto'>
        <div className='py-5'>
          <p className='text-5xl font-bold'>Weather Watcher</p>
        </div>
        <SearchCity fetch={fetchData} />
        {weather ? (
          <Card className='w-1/3 justify-center m-auto mt-10'>
            <CardHeader className='flex-row justify-between'>
              <CardTitle>{weather.name}</CardTitle>
              <CardTitle className='flex'>{weather.main.temp} °C <img className='-mt-3' src={icon} alt={weather.weather[0].description} /></CardTitle>
            </CardHeader>
            <CardContent className='text-lg'>
              <p>Maximum Temperature: {weather.main.temp_max} °C</p>
              <p>Minimum temperature: {weather.main.temp_min} °C</p>
            </CardContent>
            <CardContent className='flex justify-between text-lg'>
              <p>{weather.weather[0].description}</p>

            </CardContent>
          </Card>
        ) : (
          <p>No data available for the specified city.</p>

        )}
      </div>
      <div className='py-4'>
        <p className='text-4xl font-medium'>Recent Searches</p>
        {weatherList?.map(list => <Card className='w-1/3 justify-center m-auto mt-5' onClick={()=>handleCardClick(list.name)}>
          <CardHeader className='flex-row justify-between text-lg p-4'>
            <CardTitle>{list.name}</CardTitle>
            <CardTitle className='flex'>{list.main.temp} °C <img className='-mt-3' src={icon} alt={list.weather[0].description} /></CardTitle>
          </CardHeader>
        </Card>)}
      </div>

    </>
  );
};

export default Weather;
