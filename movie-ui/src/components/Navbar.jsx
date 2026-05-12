import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      navigate(`/search/${query}`);
      setQuery("");
    }
  };

  return (
    <nav  className="bg-blue-900 p-[10px_20px] flex justify-between h-[90px] align-middle rounded-b-lg ">
      <Link to={'/'} className="no-underline text-blue-600"><h2 className="font-bold text-black text-4xl font-serif">🎬 Movie Recoment</h2></Link>
      

      <form onSubmit={handleSearch} className="flex,gap-[10px]">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-[5px] w-[200px] rounded-2xl font-black"
        />
        <button className="py-[5px] px-[10px] cursor-pointer bg-amber-400 rounded-[20px] text-black font-bold">Search</button>
      </form>
    </nav>
  );
}



export default Navbar;