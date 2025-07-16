// components/contact/ContactMap.jsx
import './ContactMap.scss';

const ContactMap = () => {
  return (
    <section className="map-section">
      <iframe
        title="Scrap Car Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.4196375320865!2d-0.1277586842123123!3d51.507350479634155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3333333333%3A0x1234567890abcdef!2sLondon!5e0!3m2!1sen!2suk!4v1610000000000"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </section>
  );
};

export default ContactMap;
