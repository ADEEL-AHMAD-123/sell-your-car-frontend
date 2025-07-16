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
            <h1>Contact Us</h1>
            <p>Have a question? We're here to help you scrap your car with ease.</p>
          </div>
        </div>
      </section>

      <ContactInfo />
      <ContactForm />
      <ContactMap />

      <FreeQuoteCTA
        heading="Need More Help?"
        paragraph="Still have questions or need support? Our team is here to help you with anything related to scrapping your car. Don't hesitate to get in touch."
        buttonText="Contact Support"
      />
    </>
  );
};

export default Contact;
