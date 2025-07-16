// src/pages/About.jsx
import './About.scss';
import KeyBenefits from '../../components/key benefits section/KeyBenefits';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';

const About = () => {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>We make scrapping your car fast, easy, and rewarding.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            At SellYourCar, we’re on a mission to simplify the car scrapping process for everyone in the UK. Our platform offers instant quotes, free collection, and top-tier service from start to finish.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            With over 10 years of experience in the automotive industry, we’ve built a trusted network of local scrap yards to guarantee you the best price and fastest turnaround. We believe in transparency, fair pricing, and excellent service.
          </p>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat">
          <h3>95%</h3>
          <p>Recycled Vehicles</p>
        </div>
        <div className="stat">
          <h3>10K+</h3>
          <p>Cars Processed</p>
        </div>
        <div className="stat">
          <h3>4.9⭐</h3>
          <p>Customer Rating</p>
        </div>
      </section>

      <section className="about-section" id='trust-us'>
        <div className="container">
          <h2>Why Trust Us?</h2>
          <p>
            We handle every vehicle with care and ensure our customers are satisfied at every step. Our support team is always ready to assist you throughout the journey.
          </p>
        </div>
      </section>

      <KeyBenefits />
      <FreeQuoteCTA
  heading="Want a hassle-free car scrap experience?"
  paragraph="Join thousands across the UK who’ve already trusted us for instant quotes and free collection."
  buttonText="Get My Free Quote"
/>
    </>
  );
};

export default About;
