import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");
      window.location.href = "/";
    } else {
      alert(data.error || "Login failed");
    }
  };

 return (
  <div className="login-page">
    <div className="login-container">
      <h2>Login to CropCure</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      <p className="switch-link">
        Don’t have an account? <a href="/register">Create one</a>
      </p>
    </div>
  </div>
);

}

export default Login;
