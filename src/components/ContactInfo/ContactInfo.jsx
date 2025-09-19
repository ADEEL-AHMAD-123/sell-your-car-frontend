import './ContactInfo.scss';

const ContactInfo = () => {
  return (
    <section className="contact-info-section">
      <div className="container">
        <div className="section-header">
          <h2>Get In Touch With Us</h2>
          <p>Multiple ways to reach our expert team</p>
        </div>
        
        <div className="contact-info-grid">
          <div className="info-card phone-card">
            <div className="card-icon">
              <span>📞</span>
            </div>
            <div className="card-content">
              <h3>Call Us Now</h3>
              <p className="contact-value">+44 151 6620170
</p>
              <span className="contact-subtitle">Available 24/7 for urgent queries</span>
              <a href="tel:+441516620170" className="contact-action">Call Now</a>
            </div>
          </div>

          <div className="info-card email-card">
            <div className="card-icon">
              <span>📧</span>
            </div>
            <div className="card-content">
              <h3>Email Support</h3>
              <p className="contact-value">admin@sellyourcar.info</p>
              <span className="contact-subtitle">Response within 2 hours</span>
              <a href="mailto:admin@sellyourcar.info" className="contact-action">Send Email</a>
            </div>
          </div>

          <div className="info-card location-card">
            <div className="card-icon">
              <span>📍</span>
            </div>
            <div className="card-content">
              <h3>Visit Our Office</h3>
              <p className="contact-value">105 Hoghton Lane<br />WA9 3GT</p>
              <span className="contact-subtitle">Open Mon-Fri, 9AM-5PM</span>
              <a href="https://maps.google.com/?q=105+Hoghton+Lane+WA9+3GT" target="_blank" rel="noopener noreferrer" className="contact-action">Get Directions</a>
            </div>
          </div>

          
        </div>

        <div className="contact-features">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Instant Responses</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Expert Guidance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;