import { useEffect, useState } from "react";
import api from "../services/api";
import CafeCard from "../components/CafeCard";
import "../style/Home.css";

function Home() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCafes();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchCafes = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/cafes?search=${search}`
      );

      setCafes(res.data);
    } catch (error) {
      console.error("Error fetching cafes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCafe = async (id) => {
    const confirmed = window.confirm("Delete this cafe?");

    if (!confirmed) return;

    try {
      await api.delete(`/cafes/${id}`);

      setCafes((currentCafes) =>
        currentCafes.filter((cafe) => cafe._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to delete cafe"
      );
    }
  };

  return (
    <div className="home-container">

      <div className="header">
        <div className="header-brand">
          <img
            src="/logo.svg"
            alt="Cafe Finder"
            className="header-logo"
          />
          <h1 className="header-title">Cafe Finder</h1>
        </div>

        <p className="discover">
          Discover your next favorite cafe.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search cafes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <h2 className="section-title">
        Featured Cafes
      </h2>

      {loading ? (
        <div className="loading-div">
          <h3 className="loading">Loading cafes...</h3>
        </div>
      ) : cafes.length === 0 ? (
        <div className="loading-div">
          <img
            src="/logo.svg"
            alt="No cafes"
            className="empty-logo"
          />
          <h3 className="loading">No cafes found</h3>
        </div>
      ) : (
        <div className="cafes-grid">
          {cafes.map((cafe) => (
            <CafeCard
              key={cafe._id}
              cafe={cafe}
              onDelete={deleteCafe}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Home;