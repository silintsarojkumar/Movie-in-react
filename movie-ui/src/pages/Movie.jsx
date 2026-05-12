import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reco, setReco] = useState([]);

  const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://movie-in-react.onrender.com";

useEffect(() => {
  axios
    .get(`${API_BASE}/movies/${id}`)
    .then((res) => {
      setMovie(res.data.movie);
      setReco(res.data.recommendations);
    })
    .catch((err) => console.log(err));
}, [id]);

  if (!movie) return <h2 className="font-bold text-9xl text-center">Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      {/* MAIN MOVIE */}
      <h1 className="font-bold text-4xl font-serif text-gray-700">{movie.title?.toUpperCase()}</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: "250px",
            height: "350px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <div>
          <p className="font-bold text-xl">OverView:</p>
          <p className="font-mono align-sub">{movie.overview}</p>
          <p>
            <b className="font-bold text-xl">Rating:</b> <p className="font-mono align-sub">{movie.vote_average} ⭐</p>
          </p>
          <p>
            <b className="font-bold text-xl">Genres:</b><p className="font-mono align-sub">{movie.genres}</p> 
          </p>
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* RECOMMENDED MOVIES */}
      <h2 className="font-bold text-xl">Recommended Movies</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "15px",
        }}
      >
        {reco.map((m, i) => (
          <Link
            to={`/movies/${m.index}`}
            key={i}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{
                width: "150px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "center",
                paddingBottom: "10px",
              }}
            >
              {/* Poster */}
              <img
                src={m.poster}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              {/* Title */}
              <h4 className="font-mono align-sub">
                {m.title?.toUpperCase()}
              </h4>

              <p>⭐ <b>{m.vote_average}</b></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Movie;