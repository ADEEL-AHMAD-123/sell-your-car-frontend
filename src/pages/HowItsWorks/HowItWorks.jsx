import './HowItWorks.scss';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';

const steps = [
  {
    number: '1',
    title: 'Enter Your Car Details',
    description: 'Just enter your registration and postcode. We\'ll fetch the specs instantly and show you what your car\'s worth.',
    icon: '🚗',
    color: '#FF6B6B'
  },
  {
    number: '2',
    title: 'Get an Instant Online Quote',
    description: 'See your free quote immediately – no hidden charges. We work with verified local scrap yards to offer top value.',
    icon: '💰',
    color: '#4ECDC4'
  },
  {
    number: '3',
    title: 'Think It\'s Worth More?',
    description: 'If you believe your car holds more value, no problem. Request a custom review – our team will assess and offer a revised price.',
    icon: '🔍',
    color: '#45B7D1'
  },
  {
    number: '4',
    title: 'Accept & Book Your Free Pickup',
    description: 'Like what you see? Accept the quote and choose your preferred pickup time – we collect nationwide.',
    icon: '📅',
    color: '#96CEB4'
  },
  {
    number: '5',
    title: 'We Handle Collection & Paperwork',
    description: 'Our experts arrive, collect your car, and take care of all DVLA paperwork. You don\'t lift a finger.',
    icon: '🚛',
    color: '#FFEAA7'
  },
  {
    number: '6',
    title: 'Instant Payment & Confirmation',
    description: 'Get paid directly to your bank account the moment your car is collected. Fast, secure, and confirmed.',
    icon: '✅',
    color: '#DDA0DD'
  },
];

const benefits = [
  {
    title: 'Free Nationwide Pickup',
    description: 'We collect from anywhere in the UK at no extra cost',
    icon: '🚚'
  },
  {
    title: 'Instant Online Quotes',
    description: 'Get your valuation in seconds, not days',
    icon: '⚡'
  },
  {
    title: 'Custom Offers Available',
    description: 'Think your car is worth more? We\'ll reassess',
    icon: '💬'
  },
  
];

const HowItWorks = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="how-hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>📋 Simple Process</span>
            </div>
            <h1>How It Works</h1>
            <p className="intro">
              Scrapping your car has never been easier. Get an instant quote, request a custom valuation if needed, and enjoy free pickup anywhere in the UK.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Simple Steps</span>
              </div>
              <div className="stat">
                <span className="stat-number">2min</span>
                <span className="stat-label">Average Time</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Hassle Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <div className="steps-header">
            <h2>Your Journey to Cash</h2>
            <p>Follow these simple steps to turn your old car into instant cash</p>
          </div>

          <div className="step-timeline">
            {steps.map((step, i) => (
              <div className="step-container" key={i}>
                <div className="step-card">
                  <div className="step-icon" style={{backgroundColor: step.color}}>
                    <span className="icon-emoji">{step.icon}</span>
                    <span className="step-number">{step.number}</span>
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-connector">
                    <div className="connector-line"></div>
                    <div className="connector-arrow">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-header">
            <h2>Why Choose Our Process?</h2>
            <p>We've designed every step with your convenience in mind</p>
          </div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, i) => (
              <div className="benefit-card" key={i}>
                <div className="benefit-icon">
                  <span>{benefit.icon}</span>
                </div>
                <div className="benefit-content">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="faq-preview">
        <div className="container">
          <div className="faq-content">
            <h2>Still Have Questions?</h2>
            <p>Our process is designed to be transparent and straightforward, but we understand you might have concerns.</p>
            
            <div className="quick-answers">
              <div className="answer-item">
                <span className="answer-icon">❓</span>
                <div>
                  <strong>How long does pickup take?</strong>
                  <p>Usually within 24-48 hours of accepting your quote</p>
                </div>
              </div>
              
              <div className="answer-item">
                <span className="answer-icon">💳</span>
                <div>
                  <strong>When do I get paid?</strong>
                  <p>Payment is made instantly when we collect your vehicle</p>
                </div>
              </div>
              
              <div className="answer-item">
                <span className="answer-icon">📄</span>
                <div>
                  <strong>What paperwork do I need?</strong>
                  <p>Just your V5C (log book) - we handle everything else</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FreeQuoteCTA
        heading="Ready to Start the Process?"
        paragraph="You've seen how simple it is - now experience it yourself! Get your instant quote in under 2 minutes and join thousands of satisfied customers across the UK."
      />
    </>
  );
};

export default HowItWorks;