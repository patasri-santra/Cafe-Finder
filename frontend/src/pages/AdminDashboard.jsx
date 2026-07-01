import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <div className="admin-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-heading">
        Admin Dashboard
      </h1>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Total Users</h3>
          <p className="admin-stat-value">{stats.totalUsers}</p>
        </div>

        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Total Cafes</h3>
          <p className="admin-stat-value">{stats.totalCafes}</p>
        </div>

        <div className="admin-stat-card">
          <h3 className="admin-stat-label">Total Reviews</h3>
          <p className="admin-stat-value">{stats.totalReviews}</p>
        </div>
      </div>
      <div className="admin-section">
        <h2 className="admin-section-heading">
          ⭐ Top Rated Cafes
        </h2>

        {stats.topCafes?.length > 0 ? (
          stats.topCafes.map((cafe) => (
            <div key={cafe._id} className="admin-list-row">
              <span className="admin-list-name">{cafe.name}</span>
              <span className="admin-list-badge">⭐ {cafe.rating}</span>
            </div>
          ))
        ) : (
          <p className="admin-empty">No data available</p>
        )}
      </div>
      <div className="admin-section">
        <h2 className="admin-section-heading">
          📝 Most Reviewed Cafes
        </h2>

        {stats.mostReviewed?.length > 0 ? (
          stats.mostReviewed.map((cafe) => (
            <div key={cafe._id} className="admin-list-row">
              <span className="admin-list-name">{cafe.name}</span>
              <span className="admin-list-badge">{cafe.numReviews} Reviews</span>
            </div>
          ))
        ) : (
          <p className="admin-empty">No data available</p>
        )}
      </div>
      <div className="admin-section">
        <h2 className="admin-section-heading">
          👥 Latest Users
        </h2>

        {stats.latestUsers?.length > 0 ? (
          stats.latestUsers.map((user) => (
            <div key={user._id} className="admin-user-row">
              <p className="admin-user-name">{user.name}</p>
              <p className="admin-user-email">{user.email}</p>
            </div>
          ))
        ) : (
          <p className="admin-empty">No users found</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;