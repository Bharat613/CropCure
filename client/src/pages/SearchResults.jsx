import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        // 🌿 Wikipedia API for agricultural info
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrsearch=${encodeURIComponent(
            query + " agriculture"
          )}&gsrlimit=10&prop=pageimages|extracts&exintro=true&explaintext=true&piprop=thumbnail&pithumbsize=400`
        );

        const data = await response.json();

        if (data.query && data.query.pages) {
          const formatted = Object.values(data.query.pages).map((page) => ({
            title: page.title,
            description: page.extract,
            image: page.thumbnail?.source || defaultImage,
            link: `https://en.wikipedia.org/?curid=${page.pageid}`,
          }));
          setResults(formatted);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for “{query}”</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="results-grid">
          {results.map((res, i) => (
            <div key={i} className="result-card">
              <img
                src={res.image || defaultImage}
                alt={res.title}
                onError={(e) => (e.target.src = defaultImage)} // fallback if image fails to load
              />
              <h3>{res.title}</h3>
              <p>{res.description?.slice(0, 120)}...</p>
              <a href={res.link} target="_blank" rel="noreferrer">
                Learn More
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found. Try another keyword.</p>
      )}
    </div>
  );
};

export default SearchResults;
