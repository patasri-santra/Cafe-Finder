import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import "../style/CafeCard.css";

function CafeCard({ cafe, onDelete }) {
  const navigate = useNavigate();

  const openDetails = () => {
    navigate(`/cafes/${cafe._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(cafe._id);
  };

  return (
    <div
      role="button"
      tabIndex="0"
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      className="cafe-card"
    >
      {cafe.image && (
        <img
          src={cafe.image}
          alt={cafe.name}
          className="cafe-img"
        />
      )}

      <div className="cafe-card-header">
        <h2 className="cafe-name">
          {cafe.name}
        </h2>

        <div className="cafe-card-actions">
          <Link
            to={`/cafes/${cafe._id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="btn-edit"
            title="Edit cafe"
            aria-label={`Edit ${cafe.name}`}
          >
            <Pencil className="icon-svg" />
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="btn-delete"
            title="Delete cafe"
            aria-label={`Delete ${cafe.name}`}
          >
            <Trash2 className="icon-svg" />
          </button>
        </div>
      </div>

      <p className="cafe-description">
        {cafe.description}
      </p>

      <div className="cafe-rating-row">
        <span>
          ⭐ {cafe.rating?.toFixed(1) || 0}
        </span>

        <span>{cafe.city}</span>
      </div>

      <div className="cafe-review-badge">
        {cafe.numReviews || 0} reviews
      </div>
    </div>
  );
}

export default CafeCard;