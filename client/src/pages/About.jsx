import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <h2>About CropCure 🌿</h2>
      <p>
        <strong>CropCure</strong> is an AI-powered web application that helps
        farmers detect and manage plant diseases instantly.
      </p>

      <p>
        By simply uploading or capturing a photo of a diseased leaf, our image
        recognition model (trained using <b>PlantVillage</b> datasets) identifies
        the disease and recommends the right pesticide or organic solution.
      </p>

      <p>
        Our mission is to make precision agriculture accessible for every
        farmer — empowering them with real-time insights, weather updates, and
        crop health monitoring.
      </p>

      <div className="about-features">
        <h3>Features</h3>
        <ul>
          <li>🌱 Leaf disease detection via AI model</li>
          <li>☁️ Live weather insights for your region</li>
          <li>💾 Save and revisit disease reports anytime</li>
          <li>🔍 Search for crop or disease details</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
