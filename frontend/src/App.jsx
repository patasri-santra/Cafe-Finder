import { Routes, Route, useLocation } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CafeDetails from "./pages/CafeDetails";
import Favorites from "./pages/Favorites";
import MapPage from "./pages/MapPage";
import CreateCafe from "./pages/CreateCafe";
import EditCafe from "./pages/EditCafe";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const location = useLocation();

  return (
    <>
      {
  location.pathname !== "/" &&
  location.pathname !== "/login" &&
  location.pathname !== "/register" &&
  <Navbar />
}

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<Home />} />
          <Route path="/cafes/:id" element={<CafeDetails />} />
          <Route path="/cafes/:id/edit" element={<EditCafe />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/create-cafe" element={<CreateCafe />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;