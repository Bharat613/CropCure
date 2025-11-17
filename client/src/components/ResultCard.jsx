import React from "react";
import "./ResultCard.css";

export default function ResultCard({ result }) {
  if (!result) return null;

  const pesticides = Array.isArray(result.pesticides) ? result.pesticides : [];
  const fertilizers = Array.isArray(result.fertilizers) ? result.fertilizers : [];

  return (
    <div className="result-card">
      <h3>Prediction: {result.prediction || "N/A"}</h3>

      {/* Use confidence directly from backend */}
      <p>Confidence: {result.confidence ? result.confidence.toFixed(2) + "%" : "N/A"}</p>

      <p>Pesticides: {pesticides.length ? pesticides.join(", ") : "N/A"}</p>
      <p>Fertilizers: {fertilizers.length ? fertilizers.join(", ") : "N/A"}</p>
      <p>Notes: {result.notes || "N/A"}</p>

      {result.description && (
        <div className="description">
          <h4>Description:</h4>
          <p>{result.description}</p>
        </div>
      )}
    </div>
  );
}
