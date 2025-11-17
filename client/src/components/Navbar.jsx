import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${search}`);
      setSearch("");
    }
  };

  // Cloudinary default or user profile image
  const profileImage =
    user?.profilePic ||
    "profile.png";

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Logo" />
        CropCure
      </div>

      {/* Search */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search crops, diseases, fertilizers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Links + Profile */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/saved">Saved</Link>

        {/* Profile Icon */}
        <div
          className="profile-wrapper"
          onClick={() => navigate("/profile")}
          title="View Profile"
        >
          <img className="profile-icon" src={profileImage} alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
