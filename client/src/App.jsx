import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Saved from "./pages/Saved";
import Details from "./pages/Details";
import ImageUploader from "./components/ImageUploader";
import ResultPage from "./pages/ResultPage";
import SearchResults from "./pages/SearchResults"; // ✅ Search Page Import
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./components/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Main Navigation Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/details/:id" element={<Details />} />
      <Route path="/profile" element={<Profile />} />

        {/* 🌿 CropCure Image Scanning Flow */}
        <Route path="/scan" element={<ImageUploader />} />
        <Route path="/result" element={<ResultPage />} />

        {/* 🔍 Search Results Page */}
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
