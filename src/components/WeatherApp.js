import React, { useState, useEffect } from 'react';

export default function WeatherApp() {
  const [searchType, setSearchType] = useState('live');
  const [city, setCity] = useState('Ahmedabad');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = '3d33921782df015775ea63a0efb990da';

  useEffect(() => {
    if (searchType === 'live') {
      fetchWeatherByLocation();
    } else {
      fetchWeatherByCity();
    }
  }, [searchType]);

  const fetchWeatherByLocation = async () => {
    setIsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiurl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;
        const res = await fetch(apiurl);

        if (!res.ok) {
          throw new Error('Weather data not available');
        }

        const resData = await res.json();
        setData(resData);
        setCity(resData.name); 
        setError(null);
      });
    } catch (error) {
      setData(null);
      setError('Weather data not available');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    setIsLoading(false);
    try {
      const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
      const res = await fetch(apiurl);
      if (!res.ok) {
        throw new Error('City not found');
      }
      const resData = await res.json();
      setData(resData);
      setError(null);
    } catch (error) {
      setData(null);
      setError('City not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  const getWeather = async (event) => {
    event.preventDefault();
    if (searchType === 'live') {
      fetchWeatherByLocation();
    } else {
      fetchWeatherByCity();
    }
  };

  return (
    <div className='main'>
      <div className="w-card">
        <form onSubmit={getWeather}>
          <button className='livebtn' onClick={() => handleSearchTypeChange('live')}>
            <img src="https://icon2.cleanpng.com/20180328/gzq/kisspng-computer-icons-computer-software-location-icon-5abbd600aa85b6.1407853215222594566985.jpg" alt="" />
          </button>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onClick={() => handleSearchTypeChange('manual')}
          />
          <br />
          <button type="submit"><img src={require('../assets/images/search.png')} alt="" /></button>
        </form>
        {isLoading ? "Loading..." : ""}
        {!isLoading && data && data.weather && (
          <div className="details">
            {data.weather[0].main === "Clear" && <img className='wimg' src={require('../assets/images/clear.png')} alt="" />}
            {data.weather[0].main === "Clouds" && <img className='wimg' src={require('../assets/images/clouds.png')} alt="" />}
            {data.weather[0].main === "Rain" && <img className='wimg' src={require('../assets/images/rain.png')} alt="" />}
            {data.weather[0].main === "Drizzle" && <img className='wimg' src={require('../assets/images/drizzle.png')} alt="" />}
            {data.weather[0].main === "Smoke" && <img className='wimg' src={require('../assets/images/mist.png')} alt="" />}
            {data.weather[0].main === "Snow" && <img className='wimg' src={require('../assets/images/snow.png')} alt="" />}
            <h3>{data.name}</h3>
            <h3>{data.main && Math.round(data.main.temp)}°C</h3>
          </div>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
