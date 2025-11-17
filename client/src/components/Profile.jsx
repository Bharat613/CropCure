import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import defaultProfile from "/profile.png";
import { FaTrash } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", history: [] });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else {
      axios
        .get("https://cropcure-qomt.onrender.com/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteScan = async (scanId) => {
    if (!window.confirm("Are you sure you want to delete this scan?")) return;

    // Apply fade-out
    setDeletingId(scanId);

    // Remove the card from state immediately after fade-out
    setTimeout(async () => {
      setUser(prev => ({
        ...prev,
        history: prev.history.filter(item => item.id !== scanId)
      }));

      const token = localStorage.getItem("token");
      try {
        await axios.delete(`https://cropcure-qomt.onrender.com/delete-scan/${scanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // No need to fetch profile again, already removed from UI
      } catch (err) {
        console.log(err);
        alert("Failed to delete scan.");
      }
      setDeletingId(null);
    }, 500); // match CSS fade duration
  };

  const viewScan = (item) => {
    localStorage.setItem("leafImage", item.image_url);
    localStorage.setItem("diseaseName", item.disease_name);
    localStorage.setItem("confidence", item.confidence);
    localStorage.setItem("pesticides", JSON.stringify(item.pesticides || []));
    localStorage.setItem("fertilizers", JSON.stringify(item.fertilizers || []));
    localStorage.setItem("description", item.description || "");
    localStorage.setItem("notes", item.notes || "");
    navigate("/result");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={defaultProfile} alt="Profile" />
        <div className="profile-info">
          <h2>Hello, {user.name}</h2>
          <p>{user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="history-section">
        <h3>Previous Scans</h3>
        <div className="history-grid">
          {user.history.length === 0 ? (
            <p>No previous scans found.</p>
          ) : (
            user.history.map(item => (
              <div
                key={item.id}
                className={`history-card ${deletingId === item.id ? "fade-out" : ""}`}
                onClick={() => viewScan(item)}
              >
                <div
                  className="history-card-header"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteScan(item.id)}
                  />
                </div>
                {item.image_url && (
                  <img src={item.image_url} alt="Leaf" className="leaf-image" />
                )}
                <p>{item.disease_name}</p>
                <p>Confidence: {item.confidence}%</p>
                <p>{item.timestamp}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
