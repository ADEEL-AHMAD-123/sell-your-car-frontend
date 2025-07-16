// components/ContactInfo.jsx
import './ContactInfo.scss';

const ContactInfo = () => {
  return (
    <section className="contact-info container">
      <div className="info-card">
        <h3>📞 Call Us</h3>
        <p>+44 1234 567890</p>
      </div>
      <div className="info-card">
        <h3>📧 Email</h3>
        <p>support@scrapcarapp.co.uk</p>
      </div>
      <div className="info-card">
        <h3>📍 Location</h3>
        <p>123 Scrap Car Road, London, UK</p>
      </div>
    </section>
  );
};

export default ContactInfo;
