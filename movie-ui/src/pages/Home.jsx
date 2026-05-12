import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Banner from "../components/Banner";



function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // fetch movies
  const fetchMovies = async (pageNum) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/movies?page=${pageNum}`
      );

      setMovies((prev) => [...prev, ...res.data.movies]);
      setHasMore(res.data.has_more);
      setPage(pageNum);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // initial load
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // ⭐ 60% SCROLL TRIGGER
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrolledPercent = (scrollTop + windowHeight) / docHeight;

      // 👉 60% reached
      if (scrolledPercent >= 0.9) {
        fetchMovies(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  return (
     
    <div className="[p-[20px]]">
      <Banner />
      <div>
        <img src="" alt="" />
      </div>
      <h1 className="font-bold, text-4xl font-semibold m-10">All Movies</h1>

      <div
        
        className="flex flex-wrap gap-[15px]"
      >
        {movies.map((m, i) => (
          <div key={i} style={{ width: "180px" }}>
            <Link to={`/movies/${i}`}>
              <img
                src={m.poster}
                alt={m.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Link>

            <h4 className="font-mono align-sub">{m.title?.toUpperCase()} <p>⭐ <b>{m.vote_average}</b></p> </h4>
            
          </div>
        ))}
      </div>

      {loading && <p>Loading more movies...</p>}
      {!hasMore && <p>No more movies</p>}
    </div>
  );
}

export default Home;