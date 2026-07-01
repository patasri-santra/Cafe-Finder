import { useEffect, useState } from "react";
import api from "../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../style/MapPage.css";

function MapPage() {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const res = await api.get("/cafes");

      setCafes(res.data);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="map-page">
      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={13}
        className="map-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cafes.map((cafe) => (
          <Marker
            key={cafe._id}
            position={[
              cafe.location.coordinates[1],
              cafe.location.coordinates[0],
            ]}
          >
            <Popup>
              <h3>{cafe.name}</h3>

              <p>{cafe.city}</p>

              <p>
                ⭐ {cafe.rating || 0}
              </p>

              <p>
                {cafe.description}
              </p>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}

export default MapPage;