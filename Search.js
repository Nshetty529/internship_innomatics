
import React, { useState, useEffect } from 'react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [data, setData] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    fetch('/cname.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading the data:', error));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      setShowNoResults(false);
      return;
    }

    const filteredCountries = data.filter(
      country =>
        country.country.toLowerCase().includes(value.toLowerCase()) ||
        country.capital.toLowerCase().includes(value.toLowerCase())
    );
    
    setResults(filteredCountries);
    setShowNoResults(filteredCountries.length === 0);
  };

  const handleSelect = (country) => {
    setQuery(`${country.country} (${country.capital})`);
    setResults([]);
    setShowNoResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowNoResults(false);
  };

  const options = { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  };

  return (
    <div className="search-container">
      <div className="date-time-display">
        <p>{dateTime.toLocaleDateString(undefined, options)}</p>
      </div>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type country or capital name "
          aria-label="Search"
        />
        {query && (
          <button className="clear-button" onClick={handleClear} aria-label="Clear">
            &times;
          </button>
        )}
      </div>
      {query && (
        <div className="suggestions">
          {results.length > 0 ? (
            results.map((country, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSelect(country)}
              >
                {country.country} ({country.capital})
              </div>
            ))
          ) : showNoResults ? (
            <div className="suggestion-item no-results">No matching results</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Search;
