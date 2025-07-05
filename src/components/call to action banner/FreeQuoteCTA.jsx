import './FreeQuoteCTA.scss';

const FreeQuoteCTA = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Still have questions?</h2>
          <p>Get in touch or get your free quote in under 60 seconds. It's fast, easy and completely free.</p>
          <a href="#quote" className="cta-button">Get My Free Quote</a>
        </div>
        <div className="cta-pattern" aria-hidden="true"></div>
      </div>
    </section>
  );
};

export default FreeQuoteCTA;
