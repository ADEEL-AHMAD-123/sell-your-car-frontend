// components/contact/ContactForm.jsx
import './ContactForm.scss';

const ContactForm = () => {
  return (
    <section className="contact-form-section container">
      <h2>Send Us a Message</h2>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Submit Message</button>
      </form>
    </section>
  );
};

export default ContactForm;
