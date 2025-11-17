import React from "react";
import WeatherWidget from "../components/WeatherWidget";
import ImageUploader from "../components/ImageUploader";
import "../index.css";
import "./Home.css"; // new custom CSS file

function Home() {
  return (
    <div className="app-container">
      {/* Background Layer */}
      <div className="farm-background">
        <div className="sun"></div>
      </div>

      {/* Main Content */}
      <div className="app-content">
        <div className="home-layout">
          <WeatherWidget />
          <ImageUploader />
        </div>

        {/* --- Agriculture Video Section --- */}
       <section className="agri-video-section">
  <h2>🌾 Watch How Modern Agriculture Works</h2>
  <div className="video-wrapper">
    <video
      src="/agriculture.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="agri-video"
    ></video>
  </div>
</section>


        {/* --- Story of Agriculture --- */}
        <section className="agri-story-section">
          <h2>📖 Story of Indian Agriculture</h2>
          <p>
            Agriculture has been the backbone of India for thousands of years.
            From the fertile plains of the Ganges to the coastal deltas of Tamil Nadu,
            Indian farmers have nurtured the land with devotion. With modern technology,
            precision irrigation, and sustainable practices, a new green revolution is emerging —
            one that balances productivity with the planet’s wellbeing.
          </p>
        </section>

        {/* --- Today’s Market Prices --- */}
        <section className="market-price-section">
          <h2>💰 Today’s Crop Prices (Approx.)</h2>
          <div className="price-grid">
            <div className="price-card">
              <h3>Paddy</h3>
              <p>₹2,300 / Quintal</p>
            </div>
            <div className="price-card">
              <h3>Wheat</h3>
              <p>₹2,200 / Quintal</p>
            </div>
            <div className="price-card">
              <h3>Tomato</h3>
              <p>₹24 / kg</p>
            </div>
            <div className="price-card">
              <h3>Onion</h3>
              <p>₹18 / kg</p>
            </div>
            <div className="price-card">
              <h3>Potato</h3>
              <p>₹20 / kg</p>
            </div>
          </div>
        </section>

        {/* --- Famous Crops in India --- */}
        <section className="famous-crops-section">
          <h2>🌱 Famous Crops in India</h2>
          <div className="crop-gallery">
            <div className="crop-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Rice_paddy_field.jpg" alt="Paddy" />
              <p>Paddy</p>
            </div>
            <div className="crop-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Wheat_close-up.JPG" alt="Wheat" />
              <p>Wheat</p>
            </div>
            <div className="crop-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Sugarcane_field.jpg" alt="Sugarcane" />
              <p>Sugarcane</p>
            </div>
            <div className="crop-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Cotton_field.JPG" alt="Cotton" />
              <p>Cotton</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
