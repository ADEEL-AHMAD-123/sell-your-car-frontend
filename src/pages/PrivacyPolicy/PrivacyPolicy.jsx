import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faShieldAlt, 
  faDatabase, 
  faShare, 
  faLock, 
  faUserCheck, 
  faEdit, 
  faEnvelope,
  faServer,
  faEye
} from '@fortawesome/free-solid-svg-icons';

import '../TermsOfService/LegalPages.scss';
const PrivacyPolicy = () => {
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
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h1>Privacy Policy</h1>
            <p className="effective-date">Effective Date: October 26, 2023</p>
            <p className="subtitle">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                This Privacy Policy describes how <strong>SellYourCar</strong> ("we," "us," or "our") collects, uses, and discloses your information when you use our car-selling platform located at{' '}
                <a href="https://www.sellyourcar.info" className="link">www.sellyourcar.info</a>{' '}
                (the "Service"). We are committed to protecting your privacy and being transparent about our data practices.
              </p>
            </div>

            {/* Privacy Sections */}
            <div className="terms-grid">
              
              {/* Section 1 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faDatabase} className="section-icon" />
                  <h2>1. Information We Collect</h2>
                </div>
                <div className="section-content">
                  <p>We collect information you provide directly to us when you use the Service:</p>
                  
                  <div className="data-categories">
                    <div className="data-category">
                      <h3><FontAwesomeIcon icon={faUserCheck} /> Account Information</h3>
                      <ul>
                        <li>Full name and contact details</li>
                        <li>Email address and phone number</li>
                        <li>Secure password (hashed with bcrypt)</li>
                        <li>Account preferences and settings</li>
                      </ul>
                    </div>
                    
                    <div className="data-category">
                      <h3><FontAwesomeIcon icon={faServer} /> Vehicle Information</h3>
                      <ul>
                        <li>Vehicle registration number</li>
                        <li>Make, model, year, and mileage</li>
                        <li>Vehicle photos and descriptions</li>
                        <li>Condition reports and messages</li>
                        <li>Estimated price expectations</li>
                      </ul>
                    </div>
                    
                    <div className="data-category">
                      <h3><FontAwesomeIcon icon={faEdit} /> Transaction Details</h3>
                      <ul>
                        <li>Quote acceptance information</li>
                        <li>Preferred pickup dates and times</li>
                        <li>Collection addresses</li>
                        <li>Communication records</li>
                      </ul>
                    </div>
                    
                    <div className="data-category">
                      <h3><FontAwesomeIcon icon={faEye} /> Automatic Data</h3>
                      <ul>
                        <li>IP address and browser information</li>
                        <li>Device type and operating system</li>
                        <li>Usage patterns and session data</li>
                        <li>Cookies and similar technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faServer} className="section-icon" />
                  <h2>2. Third-Party Data Sources</h2>
                </div>
                <div className="section-content">
                  <div className="third-party-info">
                    <h3>Vehicle Data Verification</h3>
                    <p>
                      To provide you with accurate quotes, we use your car's registration number to fetch additional vehicle data from authorized third-party services, including the DVLA (Driver and Vehicle Licensing Agency).
                    </p>
                    
                    <div className="data-fetched">
                      <h4>Data Retrieved Includes:</h4>
                      <ul>
                        <li>Vehicle revenue weight and specifications</li>
                        <li>Fuel type and engine details</li>
                        <li>Official color registration</li>
                        <li>MOT (Ministry of Transport) status and history</li>
                        <li>Tax status and classification</li>
                        <li>Insurance write-off markers</li>
                      </ul>
                    </div>
                    
                    <div className="highlight-box">
                      <strong>Privacy Note:</strong> This data is retrieved using only your vehicle registration number and is used solely for valuation purposes.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faUserCheck} className="section-icon" />
                  <h2>3. How We Use Your Information</h2>
                </div>
                <div className="section-content">
                  <div className="usage-purposes">
                    <h3>Primary Uses</h3>
                    <ul>
                      <li><strong>Quote Generation:</strong> Create automatic and manual car valuations</li>
                      <li><strong>Account Management:</strong> Manage your profile and track DVLA check limits</li>
                      <li><strong>Communication:</strong> Facilitate contact between users and administrators</li>
                      <li><strong>Notifications:</strong> Send email updates about quote status and progress</li>
                      <li><strong>Service Delivery:</strong> Coordinate vehicle collection and transaction completion</li>
                    </ul>
                    
                    <h3>Secondary Uses</h3>
                    <ul>
                      <li>Customer support and troubleshooting</li>
                      <li>Service improvement and analytics</li>
                      <li>Fraud prevention and security</li>
                      <li>Legal compliance and dispute resolution</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faShare} className="section-icon" />
                  <h2>4. Information Sharing</h2>
                </div>
                <div className="section-content">
                  <p>We may share your information in specific, limited circumstances:</p>
                  
                  <div className="sharing-scenarios">
                    <div className="sharing-category">
                      <h3><FontAwesomeIcon icon={faUserCheck} /> With Our Team</h3>
                      <p>
                        Your contact information, vehicle details, messages, and collection preferences are shared with our administrators to facilitate your car sale and provide customer support.
                      </p>
                    </div>
                    
                    <div className="sharing-category">
                      <h3><FontAwesomeIcon icon={faServer} /> With Service Providers</h3>
                      <p>
                        We share your vehicle registration number with authorized third-party services (such as DVLA) to retrieve official vehicle data for accurate valuations.
                      </p>
                    </div>
                    
                    <div className="sharing-category">
                      <h3><FontAwesomeIcon icon={faShieldAlt} /> Legal Requirements</h3>
                      <p>
                        We may disclose your information if required by law, court order, or government regulation, or to protect our rights and safety.
                      </p>
                    </div>
                  </div>
                  
                  <div className="no-sharing-box">
                    <strong>We Do Not:</strong>
                    <ul>
                      <li>Sell your personal information to third parties</li>
                      <li>Share data with marketing companies</li>
                      <li>Use your information for advertising</li>
                      <li>Provide data to unauthorized parties</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faLock} className="section-icon" />
                  <h2>5. Data Security & Protection</h2>
                </div>
                <div className="section-content">
                  <div className="security-measures">
                    <h3>Technical Safeguards</h3>
                    <ul>
                      <li><strong>Password Protection:</strong> All passwords are hashed using industry-standard bcrypt encryption</li>
                      <li><strong>Secure Authentication:</strong> JSON Web Tokens (JWTs) with secure, HTTP-only cookies</li>
                      <li><strong>Data Encryption:</strong> Sensitive data encrypted in transit and at rest</li>
                      <li><strong>Access Controls:</strong> Role-based access restrictions for internal users</li>
                      <li><strong>Regular Updates:</strong> Ongoing security patches and system monitoring</li>
                    </ul>
                    
                    <h3>Operational Security</h3>
                    <ul>
                      <li>Limited access to personal data on a need-to-know basis</li>
                      <li>Regular security training for our team</li>
                      <li>Incident response procedures</li>
                      <li>Data backup and recovery systems</li>
                    </ul>
                  </div>
                  
                  <div className="security-notice">
                    <strong>Important:</strong> While we implement robust security measures, no method of internet transmission or electronic storage is 100% secure. We continuously work to improve our security practices.
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faUserCheck} className="section-icon" />
                  <h2>6. Your Rights & Choices</h2>
                </div>
                <div className="section-content">
                  <div className="user-rights">
                    <h3>Data Control Rights</h3>
                    <ul>
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Update or correct your account information</li>
                      <li><strong>Deletion:</strong> Request removal of your account and data</li>
                      <li><strong>Portability:</strong> Receive your data in a structured format</li>
                      <li><strong>Objection:</strong> Object to certain uses of your information</li>
                    </ul>
                    
                    <h3>How to Exercise Your Rights</h3>
                    <ul>
                      <li>Update account information directly in your profile</li>
                      <li>Contact us for data deletion or access requests</li>
                      <li>Opt out of email communications using unsubscribe links</li>
                      <li>Manage cookie preferences in your browser settings</li>
                    </ul>
                  </div>
                  
                  <div className="response-time">
                    <strong>Response Time:</strong> We will respond to your requests within 30 days of receipt.
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faEdit} className="section-icon" />
                  <h2>7. Data Retention</h2>
                </div>
                <div className="section-content">
                  <div className="retention-info">
                    <h3>How Long We Keep Your Data</h3>
                    <ul>
                      <li><strong>Account Data:</strong> Retained while your account is active</li>
                      <li><strong>Transaction Records:</strong> Kept for 7 years for legal and tax purposes</li>
                      <li><strong>Communication Logs:</strong> Retained for 2 years for customer support</li>
                      <li><strong>Technical Logs:</strong> Automatically deleted after 1 year</li>
                    </ul>
                    
                    <h3>Deletion Policy</h3>
                    <p>
                      When you delete your account, we will remove your personal information within 30 days, except where we're legally required to retain certain records.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 8 */}
              <div className="term-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faEdit} className="section-icon" />
                  <h2>8. Policy Updates</h2>
                </div>
                <div className="section-content">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
                  </p>
                  <ul>
                    <li>Posting the updated policy on this page</li>
                    <li>Updating the effective date</li>
                    <li>Sending email notification for significant changes</li>
                    <li>Displaying a notice on our platform</li>
                  </ul>
                  
                  <div className="update-notice">
                    <strong>Your Consent:</strong> Continued use of the Service after policy updates constitutes acceptance of the revised terms.
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <div className="contact-card">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <h3>Privacy Questions or Concerns?</h3>
                <p>
                  If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy team.
                </p>
                <a href="mailto:admin@sellyourcar.info" className="contact-button">
                  <FontAwesomeIcon icon={faEnvelope} />
                  admin@sellyourcar.info
                </a>
                <p className="contact-note">
                  We typically respond to privacy inquiries within 24-48 hours.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;