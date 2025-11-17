import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Details.css";

const Details = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;

  if (!item)
    return (
      <div className="details-page">
        <p>No details found.</p>
        <button onClick={() => navigate("/saved")}>Back to Saved</button>
      </div>
    );

  return (
    <div className="details-page">
      <h2>{item.name}</h2>
      <img src={item.imageUrl} alt={item.name} className="details-image" />
      <p className="details-desc">{item.description}</p>
      <p className="details-meta">
        📅 {item.date} | ⏰ {item.time}
      </p>
      <button onClick={() => navigate("/saved")}>Back to Saved</button>
    </div>
  );
};

export default Details;
