import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../style/CafeDetails.css";

function CafeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const fetchCafe = async () => {
    const res = await api.get(`/cafes/${id}`);
    setCafe(res.data);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchCafe(),
          fetchReviews(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login to add a review");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/reviews/${id}`, reviewData);

      setReviewData({
        rating: 5,
        comment: "",
      });

      await Promise.all([
        fetchReviews(),
        fetchCafe(),
      ]);

      alert("Review added");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        alert("Please login again to add a review");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
        "Login required to add review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const res = await api.post(`/favorites/${id}`);
      alert(res.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login required"
      );
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        Loading cafe...
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="details-page">
        Cafe not found.
      </div>
    );
  }

  return (
    <div className="details-page">
      {cafe.image && (
        <img
          src={cafe.image}
          alt={cafe.name}
          className="details-banner"
        />
      )}

      <div className="details-header">
        <div>
          <h1 className="details-title">
            {cafe.name}
          </h1>

          <p className="details-description">
            {cafe.description}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFavorite}
          className="btn-favorite"
        >
          Favorite
        </button>
      </div>

      <div className="details-stats">
        <div className="stat-card">
          <p className="stat-label">
            Rating
          </p>
          <p className="stat-value">
            {cafe.rating?.toFixed(1) || "0.0"} / 5
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-label">
            Reviews
          </p>
          <p className="stat-value">
            {cafe.numReviews || 0}
          </p>
        </div>

        <div className="stat-card">
          <p className="stat-label">
            City
          </p>
          <p className="stat-value">
            {cafe.city}
          </p>
        </div>
      </div>

      <div className="details-info">
        <p>
          <strong>Address:</strong> {cafe.address}
        </p>

        {cafe.openingHours && (
          <p className="info-hours">
            <strong>Opening Hours:</strong>{" "}
            {cafe.openingHours}
          </p>
        )}
      </div>

      <div className="review-form-card">
        <h2 className="section-heading">
          Add Review
        </h2>

        {!isLoggedIn ? (
          <div>
            <p className="login-prompt-text">
              Login first to add your rating and review.
            </p>

            <Link
              to="/login"
              className="btn-login-prompt"
            >
              Login to Review
            </Link>
          </div>
        ) : (
          <form onSubmit={submitReview}>
            <div className="rating-picker">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    setReviewData({
                      ...reviewData,
                      rating,
                    })
                  }
                  className={`rating-btn ${
                    reviewData.rating === rating
                      ? "rating-btn-active"
                      : ""
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write your review..."
              value={reviewData.comment}
              required
              className="review-textarea"
              onChange={(e) =>
                setReviewData({
                  ...reviewData,
                  comment: e.target.value,
                })
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="btn-submit-review"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      <div>
        <h2 className="section-heading">
          Reviews
        </h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="review-card"
              >
                <div className="review-card-header">
                  <h3 className="review-author">
                    {review.user?.name || "User"}
                  </h3>

                  <span className="review-rating">
                    {review.rating} / 5
                  </span>
                </div>

                <p className="review-comment">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CafeDetails;