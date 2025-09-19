import './FreeQuoteCTA.scss';

const FreeQuoteCTA = ({
  heading,
  paragraph,
  className = ''
}) => {
  
  const handleQuoteClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
      // If on home page, scroll to top (hero section)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Otherwise redirect to home page
      window.location.href = '/';
    }
  };

  return (
    <section className={`cta-section ${className}`}>
      <div className="container">
        <div className="cta-content">
          {/* Main Content Section */}
          <div className="main-content">
            <h2>{heading}</h2>
            <p>{paragraph}</p>
            
            <div className="cta-button-wrapper">
              <button 
                onClick={handleQuoteClick}
                className="cta-button"
              >
                Get Free Quote
              </button>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="contact-section">
            <h3>Need immediate help?</h3>
            
            <div className="contact-links">
              <a 
                href="https://wa.me/447561785668"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <span className="contact-icon">📱</span>
                <div className="contact-details">
                  <div className="contact-type">WhatsApp</div>
                  <div className="contact-value">+44 7561 785668
</div>
                </div>
              </a>
              
              <a 
                href="mailto:admin@sellyourcar.info"
                className="contact-link"
              >
                <span className="contact-icon">📧</span>
                <div className="contact-details">
                  <div className="contact-type">Email Support</div>
                  <div className="contact-value">admin@sellyourcar.info</div>
                </div>
              </a>
            </div>
            
            <p className="availability-text">
              Available Monday-Friday, 9am-5pm
            </p>
          </div>
        </div>
        

      </div>
    </section>
  );
};

export default FreeQuoteCTA;