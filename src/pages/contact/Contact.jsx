import './Contact.scss';
import ContactInfo from '../../components/ContactInfo/ContactInfo';
import ContactForm from '../../components/ContactForm/ContactForm';
import ContactMap from '../../components/ContactMap/ContactMap';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';

const Contact = () => {
  return (
    <>
      <section className="contact-hero">
        <div className="overlay">
          <div className="hero-content container">
            <div className="hero-badge">
              <span>💬 Get In Touch</span>
            </div>
            <h1>Contact Our Expert Team</h1>
            <p>Ready to scrap your car? Have questions about our service? We're here to help you every step of the way with professional, friendly support.</p>
            <div className="hero-stats">
              <div className="stat">
                <strong>24/7</strong>
                <span>Support Available</span>
              </div>
              <div className="stat">
                <strong>5000+</strong>
                <span>Cars Scrapped</span>
              </div>
              <div className="stat">
                <strong>Same Day</strong>
                <span>Collection</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </section>

      <ContactInfo />
      <ContactForm />
      <ContactMap />

      <FreeQuoteCTA
        heading="Ready to Scrap Your Car?"
        paragraph="You've seen how easy it is to reach us. Now take the next step and get an instant quote for your vehicle. Our process is fast, transparent, and hassle-free."
      />
    </>
  );
};

export default Contact;