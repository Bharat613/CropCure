import React, { useEffect, useState, useRef } from "react";
import "./ResultPage.css";

export default function ResultPage() {
  const [diseaseName, setDiseaseName] = useState("");
  const [image, setImage] = useState("");
  const [confidence, setConfidence] = useState("");
  const [pesticides, setPesticides] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: null,
    humidity: null,
    wind: null,
    pressure: null,
    visibility: null,
    condition: "",
  });

  const weatherContainerRef = useRef(null);

  useEffect(() => {
    setDiseaseName(localStorage.getItem("diseaseName"));
    setImage(localStorage.getItem("leafImage"));
    setConfidence(localStorage.getItem("confidence"));
    setPesticides(JSON.parse(localStorage.getItem("pesticides")) || []);
    setFertilizers(JSON.parse(localStorage.getItem("fertilizers")) || []);
    setDescription(localStorage.getItem("description"));
    setNotes(localStorage.getItem("notes"));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(28.6139, 77.2090)
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = "e4d2848a1c8c2c8b13e32c5ae463abc6";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.main && data.wind && data.name) {
        setWeather({
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          pressure: data.main.pressure,
          visibility: data.visibility / 1000,
          condition: data.weather[0].description,
        });
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  };

  const handleAddToSaved = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        return;
      }

      const payload = {
        disease_name: diseaseName,
        confidence: confidence,
        description: description,
        pesticides,
        fertilizers,
        notes,
        image_url: image,
      };

      const res = await fetch("http://localhost:8000/save_scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Scan saved successfully!");
      } else {
        alert("⚠️ Failed to save: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save scan.");
    } finally {
      setIsSaving(false);
    }
  };

  const scrollLeft = () => weatherContainerRef.current && (weatherContainerRef.current.scrollLeft -= 200);
  const scrollRight = () => weatherContainerRef.current && (weatherContainerRef.current.scrollLeft += 200);

  if (!diseaseName) return <div className="loading">🔍 Fetching results...</div>;

  const notePoints = notes
    ? notes.split(/[.\n]/).map((n) => n.trim()).filter((n) => n.length > 0)
    : [];

  return (
    <div className="result-page">
      <h2 className="result-title">🌿 Disease Detection Result</h2>
      <div className="location">📍 Location: {weather.city ? `${weather.city}, ${weather.country}` : "Loading..."}</div>

      <div className="image-description-container">
        <img src={image} alt="Leaf" className="result-image" />
        <div className="result-description">
          <h3>{diseaseName}</h3>
          <p>
            <b>Confidence:</b>{" "}
            {confidence
              ? ((parseFloat(confidence) > 1
                  ? parseFloat(confidence)
                  : parseFloat(confidence) * 100
                ).toFixed(2) + "%")
              : "N/A"}
          </p>
          <p>{description}</p>
          <button
            className="add-saved-btn"
            onClick={handleAddToSaved}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "💾 Add to Saved"}
          </button>
        </div>
      </div>

      {notePoints.length > 0 && (
        <div className="notes">
          <h4>📝 Notes:</h4>
          <ul>{notePoints.map((point, index) => <li key={index}>{point}</li>)}</ul>
        </div>
      )}

      <div className="weather-section">
        <h3 className="weather-title">🌤️ Current Weather Details</h3>
        <button className="scroll-btn left" onClick={scrollLeft}>◀</button>
        <div className="weather-container" ref={weatherContainerRef}>
          <div className="weather-card"><h4>🌡️ Temp</h4><p>{weather.temp ? `${weather.temp}°C` : "..."}</p></div>
          <div className="weather-card"><h4>💧 Humidity</h4><p>{weather.humidity ? `${weather.humidity}%` : "..."}</p></div>
          <div className="weather-card"><h4>🌬️ Wind</h4><p>{weather.wind ? `${weather.wind} m/s` : "..."}</p></div>
          <div className="weather-card"><h4>🔽 Pressure</h4><p>{weather.pressure ? `${weather.pressure} hPa` : "..."}</p></div>
          <div className="weather-card"><h4>👁️ Visibility</h4><p>{weather.visibility ? `${weather.visibility} km` : "..."}</p></div>
          <div className="weather-card"><h4>🌈 Condition</h4><p>{weather.condition || "..."}</p></div>
        </div>
        <button className="scroll-btn right" onClick={scrollRight}>▶</button>
      </div>

      <div className="recommendation-section">
        {pesticides.length > 0 && (
          <>
            <h3 className="recommendation-title">🧴 Recommended Pesticides</h3>
            <div className="recommendation-grid">
              {pesticides.map((p, i) => (
                <div key={i} className="recommendation-card">
                  <img src={p.image} alt={p.name}
                    onError={(e) => (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")} />
                  <h3>{p.name}</h3>
                  <p>{p.manufacturer}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {fertilizers.length > 0 && (
          <>
            <h3 className="recommendation-title">🌾 Recommended Fertilizers</h3>
            <div className="recommendation-grid">
              {fertilizers.map((f, i) => (
                <div key={i} className="recommendation-card">
                  <img src={f.image} alt={f.name}
                    onError={(e) => (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")} />
                  <h3>{f.name}</h3>
                  <p>{f.manufacturer}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
