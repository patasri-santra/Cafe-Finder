import { useNavigate } from "react-router-dom";
import "../style/Welcome.css";
import coffee from "../assets/Coffee.jpg";
function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-left">
        <div className="welcome-logo-row">
          <img
            src="/logo.svg"
            alt="Cafe Finder"
            className="welcome-logo"
          />
          <span className="welcome-brand">Cafe Finder</span>
        </div>

        <h1 className="welcome-title">
          Find Your Perfect <span className="welcome-highlight">Coffee Spot</span>
        </h1>

        <p className="welcome-subtitle">
          Discover amazing cafes, share your experiences,
          rate your favorite spots, and help others find
          their next coffee destination.
        </p>

        <div className="welcome-features">
          <button
          onClick={() => navigate("/register")}
          className="welcome-feature"
        >
          ☕ Discover cafes
        </button>
        <button
          onClick={() => navigate("/register")}
          className="welcome-feature"
        >
          ❤️ Save your favorites
        </button>
        <button
          onClick={() => navigate("/register")}
          className="welcome-feature"
        >
          📍 Find cafes near you
        </button>
    
        </div>

        <button
          onClick={() => navigate("/register")}
          className="btn-get-started"
        >
          Get Started
        </button>

        <p className="welcome-login-hint">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="welcome-login-link"
          >
            Login
          </span>
        </p>
      </div>
        <div className="welcome-right">
            <img src={coffee}
             alt="Coffee image" 
             className="welcome-right-img" />
        </div>

    </div>
  );
}

export default Welcome;