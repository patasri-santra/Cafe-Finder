import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import api from "../services/api";
import "../style/EditCafe.css";

const defaultCenter = [22.5726, 88.3639];
const kolkataBounds = "88.1763,22.7395,88.5246,22.4515";

function LocationPicker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  if (!position) {
    return null;
  }

  return (
    <Marker
      position={[
        position.lat,
        position.lng,
      ]}
    />
  );
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(
        [position.lat, position.lng],
        map.getZoom()
      );
    }
  }, [map, position]);

  return null;
}

function EditCafe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    image: "",
  });

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await api.get(`/cafes/${id}`);
        const cafe = res.data;

        setForm({
          name: cafe.name || "",
          description: cafe.description || "",
          address: cafe.address || "",
          city: cafe.city || "",
          image: cafe.image || "",
        });

        if (cafe.location?.coordinates?.length >= 2) {
          setLocation({
            lng: cafe.location.coordinates[0],
            lat: cafe.location.coordinates[1],
          });
        }
      } catch (error) {
        console.error("Error fetching cafe:", error);
        alert("Failed to load cafe");
      } finally {
        setLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  const useAddressLocation = useCallback(async () => {
    const address = form.address.trim();
    const city = form.city.trim();

    if (address.length < 4) {
      alert("Please enter a more complete address");
      return;
    }

    try {
      setGeocoding(true);

      const query = [
        address,
        city || "Kolkata",
        "Kolkata",
        "West Bengal",
        "India",
      ].filter(Boolean).join(", ");

      const params = new URLSearchParams({
        format: "json",
        q: query,
        limit: "1",
        bounded: "1",
        viewbox: kolkataBounds,
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`
      );

      const results = await response.json();
      const place = results[0];

      if (place) {
        setLocation({
          lat: Number(place.lat),
          lng: Number(place.lon),
        });
      } else {
        alert("Could not find that address in Kolkata");
      }
    } catch (error) {
      console.error(error);
      alert("Could not search for that address");
    } finally {
      setGeocoding(false);
    }
  }, [form.address, form.city]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Could not get your current location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select the cafe location on the map");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/cafes/${id}`, {
        ...form,
        location: {
          type: "Point",
          coordinates: [
            location.lng,
            location.lat,
          ],
        },
      });

      alert("Cafe updated");
      navigate("/");
    } catch (error) {
      console.error("Error updating cafe:", error);
      alert(
        error.response?.data?.message ||
        "Failed to update cafe"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-loading">
        Loading cafe...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="edit-page"
    >
      <h1 className="edit-page-heading">
        Edit Cafe
      </h1>

      <div className="edit-field">
        <label className="edit-field-label" htmlFor="name">
          Cafe Name
        </label>
        <input
          id="name"
          placeholder="Cafe Name"
          value={form.name}
          required
          className="edit-input"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="edit-field">
        <label className="edit-field-label" htmlFor="city">
          City
        </label>
        <input
          id="city"
          placeholder="City"
          value={form.city}
          required
          className="edit-input"
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
        />
      </div>

      <div className="edit-field">
        <label className="edit-field-label" htmlFor="address">
          Address
        </label>
        <input
          id="address"
          placeholder="Address"
          value={form.address}
          required
          className="edit-input"
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />
      </div>

      <div className="edit-field">
        <label className="edit-field-label" htmlFor="image">
          Image URL
        </label>
        <input
          id="image"
          placeholder="https://example.com/image.jpg"
          value={form.image}
          className="edit-input"
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.value,
            })
          }
        />
      </div>

      <div className="location-block">
        <div className="location-toolbar">
          <span className="location-label">
            {geocoding ? "Finding location..." : "Cafe Location"}
          </span>

          <div className="location-actions">
            <button
              type="button"
              onClick={useAddressLocation}
              disabled={geocoding}
              className="btn-location-action"
            >
              Use address location
            </button>

            <button
              type="button"
              onClick={useCurrentLocation}
              className="btn-location-action"
            >
              Use my current location
            </button>
          </div>
        </div>

        <div className="location-map-box">
          <MapContainer
            center={location ? [location.lat, location.lng] : defaultCenter}
            zoom={13}
            className="location-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationPicker
              position={location}
              onChange={setLocation}
            />

            <RecenterMap
              position={location}
            />
          </MapContainer>
        </div>

        {!location && (
          <span className="location-hint">
            Click on the map to set the cafe's location.
          </span>
        )}
      </div>

      <div className="edit-field">
        <label className="edit-field-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Description"
          value={form.description}
          className="edit-textarea"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
      </div>

      <button
        disabled={saving}
        className="btn-save-changes"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default EditCafe;