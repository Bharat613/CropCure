import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <h2>Contact Us 📬</h2>

      {submitted ? (
        <p className="thank-you">Thank you! We’ll get back to you soon. 🌾</p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Message:
            <textarea
              name="message"
              required
              rows="4"
              value={form.message}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
};

export default Contact;
