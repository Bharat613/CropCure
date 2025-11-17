import React, { useEffect, useState } from "react";
import SaveCard from "../components/SaveCard";
import "./Saved.css";

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    fetch("https://cropcure-qomt.onrender.com/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setSavedItems(data.history);
      })
      .catch((err) => console.error("History fetch error:", err));
  }, []);

  const handleDelete = async (scanId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`https://cropcure-qomt.onrender.com/delete-scan/${scanId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSavedItems((prev) => prev.filter((item) => item._id !== scanId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete scan");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="saved-page">
      <h2>Saved Diagnoses</h2>
      <div className="saved-list">
        {savedItems.length > 0 ? (
          savedItems.map((item) => (
            <SaveCard key={item._id} item={item} onDelete={handleDelete} />
          ))
        ) : (
          <p>No saved records yet.</p>
        )}
      </div>
    </div>
  );
};

export default Saved;
