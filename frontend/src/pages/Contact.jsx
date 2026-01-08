import { useState } from "react";

const API = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill all fields.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Failed to send");
      }

      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        <div className="contact-left">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-desc">
            Send us your questions or feedback — we respond within 24 hours.
          </p>

          <div className="contact-info">
            <p><strong>Email:</strong> support@fluencyassist.com</p>
            <p><strong>Location:</strong> Bengaluru, India</p>
          </div>
        </div>

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <input
            className="contact-input"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="contact-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <textarea
            className="contact-input"
            name="message"
            rows="4"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
          />

          {status && (
            <p style={{ color: status.includes("success") ? "green" : "red" }}>
              {status}
            </p>
          )}

          <button className="contact-submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>

      </div>
    </div>
  );
}
