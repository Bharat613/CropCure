import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "./Register.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registration successful!");
      window.location.href = "/login";
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
  <div className="register-page">
    <div className="register-container">
      <h2>Create CropCure Account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Register</button>
      </form>

      <p className="switch-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  </div>
);

}

export default Register;
