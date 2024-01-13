import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'

// Helper function that works like Python zip()
const zip = (a, b) => a.map((k, i) => [k, b[i]])

const FindCountriesInput = ({searchQuery, onChange}) => {
  return (
    <form>
      <div>
        find countries: <input id='countryInput' value={searchQuery} onChange={onChange}/>
      </div>
    </form>
  )
}

const CountriesList = ({countries, onShowButtonClick}) => {
  if (countries===null || countries.length===1){
    return null
  }
  else if (countries.length > 10){
    return <div>Too many matches, specify another filter</div>
  }
  return countries.map(country => <div key={country.name.common}>{country.name.common} <button onClick={onShowButtonClick(country)}>show</button></div>)
}


const WeatherView = ({countries, weather}) => {
  const countryInfo = countries[0]
  if (countries===null 
    || countries.length !== 1
    ){
    return null
  }
  else if (weather === null
    || weather === undefined){
      return (<h2>{`Weather data unavailable for ${countryInfo.name.common}`}</h2>)
    }

  return (
    <div>
      <h2>Weather in {countryInfo.capital[0]}</h2>
      <p>{`temperature ${weather.main.temp} Celsius`}</p>
      <img src={weatherService.getWeatherIconUrl(weather)} alt={`${countryInfo.capital[0]} weather icon`} />
      <p>{`wind ${weather.wind.speed} m/s`}</p>
    </div>
  )
}


const CountryView = ({countries, weather, searchQuery}) => {
  if (countries === null || countries.length !== 1){
    return null
  }
  const countryInfo = countries[0]

  return(
    <>
      <h1>{countryInfo.name.common}</h1>
      {Object.keys(countryInfo).includes('capital') && countryInfo.capital.length !== 0 ? <p>capital {countryInfo.capital[0]}</p> : null}
      <p>area {countryInfo.area}</p>
      <h3>languages:</h3>
      <ul>
      {zip(Object.keys(countryInfo.languages), Object.values(countryInfo.languages)).map(l => <li key={l[0]}>{l[1]}</li>)}
      </ul>
      <img src={countryInfo.flags.png} alt={`${countryInfo.name.common} Flag`}/>
      <WeatherView countries={countries} weather={weather}/>
    </>
  )
}



function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState(null)
  const [allCountryData, setAllCountryData] = useState(null)
  const [weather, setWeather] = useState(null)


  const onShowButtonClick = (country) => () => {
    setQuery(country.name.common)
  }


  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }


  useEffect(() => {
    if (query !== ''){
      // If our query is exactly equal to a country name then show that country, otherwise show the list of countries
      if (!allCountryData.find(country => country.name.common.toLowerCase() === query.toLowerCase())){
        setCountries(allCountryData.filter(country => country.name.common.toLowerCase().startsWith(query.toLowerCase())))
      }
      else{
        setCountries(allCountryData.filter(country => country.name.common.toLowerCase() === query.toLowerCase()))
      }
    }
    else{
      setCountries(null)
    }
  }, [query])

  // Just load in all the country data right at the beginning so we don't have to make a ton of API calls
  useEffect(() => {
    countriesService
      .getAll()
      .then(countries => {
        setAllCountryData(countries)
    })
  }, [])


  useEffect(() => {
    if (countries !== null
      && countries.length==1
      && Object.keys(countries[0].capitalInfo).includes('latlng')){
        weatherService
          .getWeather(countries[0].capitalInfo.latlng[0], countries[0].capitalInfo.latlng[1])
          .then(weatherData => 
            setWeather(weatherData)
            )
      }
    else{
      setWeather(null)
    }
  }, [countries])





  return (
    <>
      <FindCountriesInput searchQuery={query} onChange={handleQueryChange}/>
      <CountryView countries={countries} weather={weather} searchQuery={query} />
      <CountriesList countries={countries} onShowButtonClick={onShowButtonClick}/>
    </>
  )
}

export default App
