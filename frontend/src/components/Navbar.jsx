import { Link, useNavigate } from "react-router-dom";
import "../style/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  let user = null;

try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
} catch (err) {
  console.error("Invalid user data in localStorage");
  localStorage.removeItem("user");
}
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  return (
    <nav className="nav_container">
      <div className="container">
        <Link
          to="/home"
          className="root"
        >
          Cafe Finder
        </Link>

        <div className="link">
          <Link to="/home">Home</Link>
          <Link to="/create-cafe"> Add Cafe </Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/map">Map</Link>

          {isAdmin && (
            <Link to="/admin" className="link">
              Admin
            </Link>
          )}


          {user ? (
            <button
              onClick={handleLogout}
              className="nav-logout-btn"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )} 
        </div>
      </div>
    </nav>
  );
}

export default Navbar;