import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Search() {
  const { query } = useParams();
  const [results, setResults] = useState([]);

  const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://movie-in-react.onrender.com";

useEffect(() => {
  if (!query) return;

  axios
    .get(`${API}/search/${query}`)
    .then(res => setResults(res.data.results))
    .catch(err => console.log(err));
}, [query]);

  return (
    <div className="p5">
      <h2>Search Results for "{query}"</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {results.map((m, i) => (
          <div key={i} style={{ width: "180px" }}>
            
            <Link to={`/movies/${m.index ?? i}`}>
              <img
                src={m.poster_url}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Link>

            <h4>{m.title?.toUpperCase()}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;