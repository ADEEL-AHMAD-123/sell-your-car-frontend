import { useState } from 'react';
import './ContactForm.scss';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="contact-form-section">
      <div className="container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Send Us a Message</h2>
            <p>Got a specific question? Fill out the form below and we'll get back to you within 2 hours during business hours.</p>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+44 1234 567890"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Get a Quote</option>
                    <option value="collection">Collection Enquiry</option>
                    <option value="support">General Support</option>
                    <option value="complaint">Make a Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your car, any specific requirements, or ask us any questions..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                <p className="form-note">
                  * Required fields. We respect your privacy and never share your information.
                </p>
              </div>
            </form>

            <div className="form-benefits">
              <div className="benefit">
                <span className="benefit-icon">⚡</span>
                <div>
                  <strong>Quick Response</strong>
                  <p>We respond to all messages within 2 hours during business hours</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🎯</span>
                <div>
                  <strong>Expert Advice</strong>
                  <p>Get personalized guidance from our car scrapping experts</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔒</span>
                <div>
                  <strong>Secure & Private</strong>
                  <p>Your information is encrypted and never shared with third parties</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;