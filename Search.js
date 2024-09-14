import React, { useState, useEffect } from 'react';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [data, setData] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    fetch('/cname.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading the data:', error));
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

  return (
    <div className="search-container">
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
