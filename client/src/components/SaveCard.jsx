import React from "react";
import { FaTrash } from "react-icons/fa";
import "./SaveCard.css";

const SaveCard = ({ item, onDelete }) => {
  const formattedDate = item.timestamp?.$date
    ? new Date(item.timestamp.$date).toLocaleString()
    : new Date(item.timestamp).toLocaleString();

  return (
    <div className="save-card">
      <button className="delete-btn" onClick={() => onDelete(item._id)}>
        <FaTrash />
      </button>
      <img src={item.image_url} alt={item.disease_name} />
      <h3>{item.disease_name}</h3>
      <p>
        <b>Confidence:</b> {parseFloat(item.confidence).toFixed(2)}%
      </p>
      <p>{item.description}</p>
      <p className="date">
        Saved Date: <i>{formattedDate}</i>
      </p>
    </div>
  );
};

export default SaveCard;
