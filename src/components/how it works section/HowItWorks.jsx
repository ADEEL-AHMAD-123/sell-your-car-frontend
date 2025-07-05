import './HowItWorks.scss';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2>How It Works</h2>
        <p className="subtitle">It’s quick and easy – get started in just a few steps.</p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter your car details</h3>
            <p>Provide your vehicle registration and postcode to get a free instant quote.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Accept your quote</h3>
            <p>We’ll offer the best price. Once accepted, we’ll schedule your free pickup.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get paid instantly</h3>
            <p>We collect your car and transfer the money straight to your account.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
