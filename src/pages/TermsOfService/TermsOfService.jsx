import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShieldAlt, faUsers, faFileContract, faGavel, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './LegalPages.scss';

const TermsOfService = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="legal-page">
      {/* Header Section */}
      <div className="legal-header">
        <div className="container">
          <button 
            onClick={handleBackClick}
            className="back-button"
            aria-label="Go back to previous page"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back</span>
          </button>
          
          <div className="header-content">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faFileContract} />
            </div>
            <h1>Terms of Service</h1>
            <p className="effective-date">Effective Date: October 26, 2023</p>
            <p className="subtitle">
              Please read these terms carefully before using our car-selling platform
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="legal-content">
        <div className="container">
          <div className="content-wrapper">
            
            {/* Introduction */}
            <div className="intro-section">
              <p className="intro-text">
                Welcome to <strong>SellYourCar</strong>! These Terms of Service ("Terms") govern your access to and use of our car-selling platform located at{' '}
                <a href="https://www.sellyourcar.info" className="link">www.sellyourcar.info</a>{' '}
                (the "Service"). By using our platform, you agree to these terms and conditions.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="terms-grid">
              
              {/* Section 1 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faFileContract} className="section-icon" />
                  <h2>1. Acceptance of Terms</h2>
                </div>
                <div className="section-content">
                  <p>
                    By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.
                  </p>
                  <div className="highlight-box">
                    <strong>Important:</strong> These terms constitute a legally binding agreement between you and SellYourCar.
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faUsers} className="section-icon" />
                  <h2>2. User Accounts & Eligibility</h2>
                </div>
                <div className="section-content">
                  <ul className="requirements-list">
                    <li>You must be at least <strong>18 years old</strong> to use the Service</li>
                    <li>You are responsible for maintaining the confidentiality of your account information</li>
                    <li>You must provide accurate, current, and complete information during registration</li>
                    <li>Required information includes: full name, email address, and phone number</li>
                    <li>You are liable for all activities that occur under your account</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faShieldAlt} className="section-icon" />
                  <h2>3. User Content & Responsibilities</h2>
                </div>
                <div className="section-content">
                  <p>You are solely responsible for all content you upload, including car listings, descriptions, and photos ("User Content").</p>
                  
                  <div className="content-rules">
                    <h3>Content License</h3>
                    <p>By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content in connection with the Service.</p>
                    
                    <h3>Content Standards</h3>
                    <ul>
                      <li>Content must be accurate and not misleading</li>
                      <li>You must have the right to post all content</li>
                      <li>Content must not violate any laws or regulations</li>
                      <li>Vehicle information must be truthful and current</li>
                    </ul>
                  </div>
                  
                  <div className="warning-box">
                    <strong>Important:</strong> We are not responsible for the accuracy of any User Content. You bear full responsibility for your listings.
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faGavel} className="section-icon" />
                  <h2>4. Our Role as Platform</h2>
                </div>
                <div className="section-content">
                  <p>
                    Our Service is a platform that connects car sellers with our administrators to facilitate car sales. We are <strong>not a party</strong> to any transaction between you and us.
                  </p>
                  
                  <div className="platform-details">
                    <h3>What We Do:</h3>
                    <ul>
                      <li>Provide a platform for car listings</li>
                      <li>Connect sellers with our evaluation team</li>
                      <li>Facilitate the quotation process</li>
                      <li>Coordinate vehicle collection</li>
                    </ul>
                    
                    <h3>What We Don't Do:</h3>
                    <ul>
                      <li>Physically inspect vehicles before quotation</li>
                      <li>Verify accuracy of user-provided data</li>
                      <li>Guarantee the condition of any vehicle</li>
                      <li>Act as a dealer or buyer</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faShieldAlt} className="section-icon" />
                  <h2>5. Disclaimers & Limitation of Liability</h2>
                </div>
                <div className="section-content">
                  <div className="liability-section">
                    <h3>Service Disclaimer</h3>
                    <p>
                      The Service is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis. We make no warranties regarding:
                    </p>
                    <ul>
                      <li>Accuracy of any listings or valuations</li>
                      <li>Quality or availability of the service</li>
                      <li>Data provided by third-party services</li>
                      <li>Uninterrupted access to the platform</li>
                    </ul>
                    
                    <h3>Limitation of Liability</h3>
                    <div className="liability-box">
                      To the fullest extent permitted by law, <strong>SellYourCar</strong> will not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Service.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faGavel} className="section-icon" />
                  <h2>6. Account Termination</h2>
                </div>
                <div className="section-content">
                  <p>
                    We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without prior notice, for any reason including but not limited to:
                  </p>
                  <ul>
                    <li>Breach of these Terms</li>
                    <li>Fraudulent or misleading listings</li>
                    <li>Violation of applicable laws</li>
                    <li>Abusive behavior towards our team</li>
                    <li>Misuse of the platform</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faGavel} className="section-icon" />
                  <h2>7. Governing Law & Jurisdiction</h2>
                </div>
                <div className="section-content">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faEnvelope} className="section-icon" />
                  <h2>8. Changes to Terms</h2>
                </div>
                <div className="section-content">
                  <p>
                    We may update these Terms from time to time. We will notify users of any material changes by posting the new Terms on this page and updating the effective date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                  </p>
                </div>
              </div>

            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <div className="contact-card">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <h3>Questions About These Terms?</h3>
                <p>
                  If you have any questions about these Terms of Service, please don't hesitate to contact us.
                </p>
                <a href="mailto:admin@sellyourcar.info" className="contact-button">
                  <FontAwesomeIcon icon={faEnvelope} />
                  admin@sellyourcar.info
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;