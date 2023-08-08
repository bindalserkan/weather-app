import React, { useState } from "react";
const api = {
  key: "f569b5006a6ecafc5a248689e4b08d4f",
  base: "https://api.openweathermap.org/data/2.5/",
};

export default function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [isForecastOpen, setIsForecastOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${api.base}weather?q=${city}&appid=${api.key}&units=metric`)
      .then((res) => res.json())
      .then((result) => {
        setCurrentWeather(result);
        setCity("");

        const { coord } = result;
        fetch(
          `${api.base}forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${api.key}&units=metric`
        )
          .then((res) => res.json())
          .then((forecastResult) => {
            const nextFiveDays = forecastResult.list.filter(
              (item,index) => index % 8 === 0
            );
            setForecast(nextFiveDays);
          });
      });
  }

  function getFormattedDate(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Date(date * 1000).toLocaleString("en-US", options);
  }

  function toggleForecastContainer() {
    setIsForecastOpen((prevOpen) => !prevOpen);
  }

  return (
    <div
      className={
        typeof currentWeather.main === "undefined"
          ? "default"
          : currentWeather.main.temp < 0
          ? "cold"
          : currentWeather.main.temp < 15
          ? "cool"
          : currentWeather.main.temp < 25
          ? "warm"
          : "hot"
      }
    >
      <main>
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              className="search-field"
              placeholder="City..."
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
            <input type="submit" className="submit-button" value="Search" />
          </div>
        </form>

        {typeof currentWeather.main !== "undefined" ? (
          <div>
            <div className="city-and-date-container">
              <div className="city">
                {currentWeather.name}, {currentWeather.sys.country}
              </div>
              <div className="date">{getFormattedDate(currentWeather.dt)}</div>
            </div>
            <div className="weather-container">
              <div className="temperature">
                {Math.round(currentWeather.main.temp)}°C
                <img
                  src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                  alt={currentWeather.weather[0].description}
                />
              </div>
              <div className="condition">{currentWeather.weather[0].main}</div>
            </div>
            <div className="see-more-button" onClick={toggleForecastContainer}>
              See more about {currentWeather.name} (5-Day Forecast)
              <span className={`arrow ${isForecastOpen ? "up" : "down"}`}>
                {isForecastOpen ? "🔼" : "🔽"}
              </span>
            </div>
            {isForecastOpen && forecast.length > 0 && (
              <div className="forecast-container">
                {forecast.map((item) => (
                  <div key={item.dt} className="forecast-item">
                    <p>{getFormattedDate(item.dt)}</p>
                    <p>{Math.round(item.main.temp)}°C</p>
                    <p>{item.weather[0].main}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}
