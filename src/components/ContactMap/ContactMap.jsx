import './ContactMap.scss';

const ContactMap = () => {
  return (
    <section className="map-section">
      <div className="container">
        <div className="map-header">
          <h2>Find Our Location</h2>
          <p>Visit us at our office or we can come to you for free vehicle collection</p>
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            <iframe
              title="Scrap Car Location - 105 Hoghton Lane WA9 3GT"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.123456789!2d-2.7234567!3d53.4123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487b123456789abc%3A0x123456789abcdef0!2s105%20Hoghton%20Ln%2C%20WA9%203GT%2C%20UK!5e0!3m2!1sen!2suk!4v1610000000000"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="map-overlay">
              <div className="location-card">
                <div className="location-icon">📍</div>
                <div className="location-details">
                  <h4>Our Office</h4>
                  <p>105 Hoghton Lane<br />WA9 3GT</p>
                  <a 
                    href="https://maps.google.com/?q=105+Hoghton+Lane+WA9+3GT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="directions-btn"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="location-info">
            <div className="info-card">
              <h3>🕒 Opening Hours</h3>
              <div className="hours-list">
                <div className="hour-item">
                  <span>Monday - Friday</span>
                  <strong>9:00 AM - 5:00 PM</strong>
                </div>
                <div className="hour-item">
                  <span>Saturday</span>
                  <strong>9:00 AM - 3:00 PM</strong>
                </div>
                <div className="hour-item">
                  <span>Sunday</span>
                  <strong>Closed</strong>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>🚗 Free Collection Service</h3>
              <ul className="service-list">
                <li>✅ Free nationwide collection</li>
                <li>✅ Same-day pickup available</li>
                <li>✅ Professional DVLA paperwork</li>
                <li>✅ Instant payment on collection</li>
              </ul>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;