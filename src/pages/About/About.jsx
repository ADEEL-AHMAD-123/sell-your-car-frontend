import './About.scss';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚗 Our Story</span>
            </div>
            <h1>Trusted Car Scrapping Experts</h1>
            <p>We've been helping UK drivers turn their old cars into cash for over a decade. Fast, fair, and completely hassle-free.</p>
            <div className="hero-highlights">
              <div className="highlight">
                <span className="highlight-icon">⚡</span>
                <span>Instant Quotes</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🆓</span>
                <span>Free Collection</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💰</span>
                <span>Best Prices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-card">
              <div className="card-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                At SellYourCar, we're revolutionizing the car scrapping industry in the UK. Our mission is to provide instant, transparent quotes and seamless collection services that put money in your pocket without the hassle.
              </p>
              <ul className="mission-points">
                <li>✅ Transparent pricing with no hidden fees</li>
                <li>✅ Eco-friendly recycling practices</li>
                <li>✅ Exceptional customer service</li>
              </ul>
            </div>
            
            <div className="content-card">
              <div className="card-icon">📖</div>
              <h2>Our Story</h2>
              <p>
                Founded with over 10 years of automotive industry experience, we've built the UK's most trusted network of certified scrap yards. We believe every old car has value, and we're here to unlock it for you.
              </p>
              <ul className="story-points">
                <li>🏆 Industry leaders since 2014</li>
                <li>🤝 Trusted by 50,000+ customers</li>
                <li>🌍 Nationwide coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-header">
            <h2>Our Impact in Numbers</h2>
            <p>See why thousands trust us with their car scrapping needs</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">♻️</div>
              <div className="stat-number">95%</div>
              <div className="stat-label">Vehicles Recycled</div>
              <div className="stat-description">Environmentally responsible disposal</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚗</div>
              <div className="stat-number">50K+</div>
              <div className="stat-label">Cars Processed</div>
              <div className="stat-description">Successfully scrapped nationwide</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Customer Rating</div>
              <div className="stat-description">Based on verified reviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-number">24hrs</div>
              <div className="stat-label">Average Collection</div>
              <div className="stat-description">From quote to cash</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Centered Layout */}
      <section className="trust-section" id="trust-us">
        <div className="container">
          <div className="trust-content-centered">
            <div className="trust-header">
              <h2>Why Choose SellYourCar?</h2>
              <p>
                We've earned the trust of thousands across the UK by consistently delivering on our promises. Every vehicle is handled with care, every customer treated with respect, and every transaction completed with complete transparency.
              </p>
            </div>
            
            <div className="trust-features-grid">
              <div className="trust-feature">
                <div className="feature-icon">🛡️</div>
                <div className="feature-content">
                  <h4>Fully Licensed & Insured</h4>
                  <p>All our operations are fully certified and compliant with UK regulations</p>
                </div>
              </div>
              
              <div className="trust-feature">
                <div className="feature-icon">💎</div>
                <div className="feature-content">
                  <h4>No Hidden Charges</h4>
                  <p>What you see is what you get - transparent pricing from start to finish</p>
                </div>
              </div>
              
              <div className="trust-feature">
                <div className="feature-icon">🎧</div>
                <div className="feature-content">
                  <h4>24/7 Customer Support</h4>
                  <p>Our expert team is always available to help with any questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="environmental-section">
        <div className="container">
          <div className="env-content">
            <div className="env-icon">🌱</div>
            <h2>Committed to the Environment</h2>
            <p>Every car we process contributes to a <span className="highlight-text">greener future</span> through responsible recycling and disposal practices.</p>
            
            <div className="env-stats">
              <div className="env-stat">
                <span className="env-number">15,000</span>
                <span className="env-label">Tons of Steel Recycled</span>
              </div>
              <div className="env-stat">
                <span className="env-number">3,500</span>
                <span className="env-label">Gallons of Oil Recovered</span>
              </div>
              <div className="env-stat">
                <span className="env-number">98%</span>
                <span className="env-label">Parts Recycled or Reused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FreeQuoteCTA
        heading="Ready to Experience the Difference?"
        paragraph="Join over 50,000 satisfied customers who've discovered the easiest way to scrap their cars. Get your instant quote and see why we're the UK's most trusted choice."
      />
    </>
  );
};

export default About;