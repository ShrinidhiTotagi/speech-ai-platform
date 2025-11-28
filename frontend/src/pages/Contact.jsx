export default function Contact() {
  return (
    <div className="page-wrapper">
      
      <h1 className="page-title">Contact Us</h1>
      <p className="highlight-sub">
        Have questions? We're here to help — we typically respond within 24 hours.
      </p>

      <div className="contact-section">

        <div className="contact-item">
          <p className="contact-label">Email Support</p>
          <p className="contact-value">support@stutterai.com</p>
        </div>

        <div className="contact-item">
          <p className="contact-label">Partnerships</p>
          <p className="contact-value">partners@stutterai.com</p>
        </div>

        <div className="contact-item">
          <p className="contact-label">Media / PR</p>
          <p className="contact-value">media@stutterai.com</p>
        </div>

      </div>

      {/* FORM UI */}
      <div className="page-card" style={{ marginTop: "40px" }}>
        <h2 className="info-title">Send a message</h2>
        <p className="info-text">(This is UI only — backend can be added later)</p>

        <input className="contact-input" placeholder="Your Name" />
        <input className="contact-input" placeholder="Email" />
        <textarea className="contact-input" rows="4" placeholder="Message"></textarea>

        <button className="page-btn">Submit</button>
      </div>

    </div>
  );
}
