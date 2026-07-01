import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import "../style/Favorites.css";

function Favorites() {
  const [cafes, setCafes] =
    useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites =
    async () => {
      const res =
        await api.get(
          "/favorites"
        );

      setCafes(res.data);
    };

  return (
    <div className="favorites-page">
      <h1 className="favorites-heading">
        My Favorites ❤️
      </h1>

      {cafes.length === 0 ? (
        <p className="favorites-empty">
          You haven't added any cafes to your favorites yet.
        </p>
      ) : (
        <div className="favorites-list">
          {cafes.map((cafe) => (
            <div key={cafe._id} className="favorite-card">
              <h3 className="favorite-card-name">{cafe.name}</h3>

              <p className="favorite-card-description">
                {cafe.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;