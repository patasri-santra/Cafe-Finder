import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "../style/CreateCafe.css";

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

function CreateCafe() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
  });

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const useAddressLocation = useCallback(async (showAlert = true) => {
    const address = form.address.trim();
    const city = form.city.trim();

    if (address.length < 4) {
      if (showAlert) {
        alert("Please enter a more complete address");
      }
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
      } else if (showAlert) {
        alert("Could not find that address in Kolkata");
      }
    } catch (error) {
      console.error(error);
      if (showAlert) {
        alert("Could not search for that address");
      }
    } finally {
      setGeocoding(false);
    }
  }, [form.address, form.city]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      useAddressLocation(false);
    }, 900);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [form.address, form.city, useAddressLocation]);

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
      setSubmitting(true);

      let imageUrl = "";

      if (image) {
        const imageData = new FormData();
        imageData.append("image", image);

        const uploadRes = await api.post("/upload", imageData);
        imageUrl = uploadRes.data.imageUrl;
      }

      const cafePayload = {
        name: form.name,
        description: form.description,
        address: form.address,
        city: form.city,
        image: imageUrl,
        location: {
          type: "Point",
          coordinates: [
            location.lng,
            location.lat,
          ],
        },
      };

      await api.post("/cafes", cafePayload);

      alert("Cafe created");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to create cafe"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page-wrapper">
      <form
        onSubmit={handleSubmit}
        className="form"
      >
        <h1 className="form-heading">Add a Cafe</h1>

        <div className="create-field">
          <label className="create-field-label" htmlFor="name">
            Cafe Name
          </label>
          <input
            id="name"
            placeholder="e.g. Brew & Bloom"
            value={form.name || ""}
            required
            className="cafe-name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="create-field">
          <label className="create-field-label" htmlFor="city">
            City
          </label>
          <input
            id="city"
            placeholder="e.g. Kolkata"
            value={form.city || ""}
            required
            className="cafe-city"
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />
        </div>

        <div className="create-field">
          <label className="create-field-label" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            placeholder="e.g. 12 Park Street"
            value={form.address || ""}
            required
            className="cafe-address"
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        <div className="location-block">
          <div className="location-toolbar">
            <span className="cafe-location">
              {geocoding ? "Finding location..." : "Cafe Location"}
            </span>

            <div className="btn-location">
              <button
                type="button"
                onClick={() => useAddressLocation(true)}
                disabled={geocoding}
                className="address"
              >
                Use address location
              </button>

              <button
                type="button"
                onClick={useCurrentLocation}
                className="current-location"
              >
                Use my current location
              </button>
            </div>
          </div>

          <div className="map-container">
            <MapContainer
              center={location ? [location.lat, location.lng] : defaultCenter}
              zoom={13}
              className="map-location"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker
                position={location}
                onChange={setLocation}
              />

              <RecenterMap position={location} />
            </MapContainer>
          </div>

          {!location && (
            <span className="location-hint">
              Click on the map to pin the cafe's location.
            </span>
          )}
        </div>

        <div className="create-field">
          <label className="create-field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="What makes this cafe special?"
            value={form.description || ""}
            className="cafe-desc"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="create-field">
          <label className="create-field-label">
            Cafe Photo
          </label>
          <label className="file-upload-label" htmlFor="cafe-image">
            <span>
              {image ? `📷 ${image.name}` : "📷 Upload a photo"}
            </span>
            <small>Click to browse</small>
          </label>
          <input
            id="cafe-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button
          disabled={submitting}
          className="submit"
        >
          {submitting ? "Creating..." : "Create Cafe"}
        </button>
      </form>
    </div>
  );
}

export default CreateCafe;