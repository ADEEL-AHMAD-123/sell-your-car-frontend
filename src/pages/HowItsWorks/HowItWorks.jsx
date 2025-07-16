import './HowItWorks.scss';
import TrustSection from '../../components/trust section/TrustSection';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';

const steps = [
  {
    number: '1',
    title: 'Enter Your Car Details',
    description: 'Just enter your registration and postcode. We’ll fetch the specs instantly and show you what your car’s worth.',
  },
  {
    number: '2',
    title: 'Get an Instant Online Quote',
    description: 'See your free quote immediately – no hidden charges. We work with verified local scrap yards to offer top value.',
  },
  {
    number: '3',
    title: 'Think It’s Worth More?',
    description: 'If you believe your car holds more value, no problem. Request a custom review – our team will assess and offer a revised price.',
  },
  {
    number: '4',
    title: 'Accept & Book Your Free Pickup',
    description: 'Like what you see? Accept the quote and choose your preferred pickup time – we collect nationwide.',
  },
  {
    number: '5',
    title: 'We Handle Collection & Paperwork',
    description: 'Our experts arrive, collect your car, and take care of all DVLA paperwork. You don’t lift a finger.',
  },
  {
    number: '6',
    title: 'Instant Payment & Confirmation',
    description: 'Get paid directly to your bank account the moment your car is collected. Fast, secure, and confirmed.',
  },
];

const HowItWorks = () => {
  return (
    <>
      <section className="how-page">
        <div className="container">
          <h1>How It Works</h1>
          <p className="intro">
            Scrapping your car has never been easier. Get an instant quote, request a custom valuation if needed, and enjoy free pickup anywhere in the UK.
          </p>

          <div className="step-grid">
            {steps.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustSection />

      <FreeQuoteCTA
        heading="Think your car is worth more?"
        paragraph="Request a custom quote and we’ll get in touch with a revised offer – no pressure, no hassle."
        buttonText="Get My Custom Quote"
      />
    </>
  );
};

export default HowItWorks;
