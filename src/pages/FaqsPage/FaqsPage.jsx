import './FaqsPage.scss';
import FaqSection from '../../components/scrap guide section(FAQs)/ScrapGuideSection';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';
import HowItWorks from '../../components/how it works section/HowItWorks';

const quickStats = [
  {
    number: '500+',
    label: 'Questions Answered',
    icon: '❓'
  },
  {
    number: '24/7',
    label: 'Support Available',
    icon: '🎧'
  },
  {
    number: '2min',
    label: 'Average Response',
    icon: '⚡'
  },
  {
    number: '95%',
    label: 'Issues Resolved',
    icon: '✅'
  }
];

const supportChannels = [
  {
    title: 'WhatsApp Support',
    description: 'Quick messages and appointment booking',
    icon: '📱',
    action: 'Message Us',
    available: 'Mon-Fri 9AM-6PM',
    contact: '+44 7xxx xxx xxx',
    handler: () => window.open('https://wa.me/447xxxxxxx', '_blank')
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our specialists',
    icon: '📞',
    action: 'Call Us',
    available: 'Mon-Fri 9AM-6PM',
    contact: '0800 xxx xxxx',
    handler: () => window.open('tel:0800xxxxxx')
  },
  {
    title: 'Email Support',
    description: 'Send us your detailed questions',
    icon: '✉️',
    action: 'Email Us',
    available: 'Response within 2 hours',
    contact: 'help@sellyourcar.com',
    handler: () => window.open('mailto:help@sellyourcar.com')
  }
];

// Quick access topics that scroll to FAQ sections
const quickAccessTopics = [
  {
    icon: '💰',
    title: 'Pricing & Payments',
    description: 'Valuation process, payment methods, and timing',
    targetSection: 'pricing-faqs'
  },
  {
    icon: '🚛',
    title: 'Collection Service',
    description: 'Free pickup, scheduling, and nationwide coverage',
    targetSection: 'collection-faqs'
  },
  {
    icon: '📋',
    title: 'Required Documents',
    description: 'What paperwork you need and DVLA processes',
    targetSection: 'documents-faqs'
  }
];

const FaqsPage = () => {
  
  // Function to scroll to FAQ section
  const scrollToFAQSection = (sectionId) => {
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
      faqContainer.scrollIntoView({ behavior: 'smooth' });
      // You can add more specific scrolling to FAQ categories here
    }
  };

  // Function to scroll to all FAQs
  const scrollToAllFAQs = () => {
    const faqContainer = document.querySelector('.faq-container');
    if (faqContainer) {
      faqContainer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to scroll to support section
  const scrollToSupport = () => {
    const supportSection = document.querySelector('.support-section');
    if (supportSection) {
      supportSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="faqs-page">
      {/* Hero Section */}
      <section className="faqs-hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>❓ Help Center</span>
            </div>
            <h1>Frequently Asked Questions</h1>
            <p>
              Everything you need to know about our car scrapping service. Can't find what you're looking for? Our support team is here to help 24/7.
            </p>
            
            <div className="hero-actions">
              <button className="primary-action" onClick={scrollToAllFAQs}>
                Browse All FAQs
              </button>
              <button className="secondary-action" onClick={scrollToSupport}>
                Contact Support
              </button>
            </div>

            <div className="quick-stats">
              {quickStats.map((stat, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Topics */}
      <section className="quick-access">
        <div className="container">
          <div className="access-header">
            <h2>Quick Access</h2>
            <p>Jump straight to the information you need most</p>
          </div>
          
          <div className="access-grid">
            {quickAccessTopics.map((topic, i) => (
              <div 
                className="access-card" 
                key={i}
                onClick={() => scrollToFAQSection(topic.targetSection)}
              >
                <div className="access-icon">{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <div className="faq-container">
        <FaqSection />
      </div>

      {/* Support Channels */}
      <section className="support-section">
        <div className="container">
          <div className="support-header">
            <h2>Still Need Help?</h2>
            <p>Choose the support method that works best for you</p>
          </div>
          
          <div className="support-grid">
            {supportChannels.map((channel, i) => (
              <div className="support-card" key={i}>
                <div className="support-icon">{channel.icon}</div>
                <div className="support-content">
                  <h4>{channel.title}</h4>
                  <p>{channel.description}</p>
                  <div className="contact-info">{channel.contact}</div>
                  <div className="support-availability">{channel.available}</div>
                </div>
                <button 
                  className="support-action"
                  onClick={channel.handler}
                >
                  {channel.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <h2>What Our Customers Say</h2>
            <p>Real feedback from people who've used our service</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The FAQ section answered all my questions upfront. The whole process was exactly as described - no surprises!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <strong>Sarah M.</strong>
                  <span>Manchester</span>
                </div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Had a question not covered in FAQs. WhatsApp support was super quick and helpful. Got my car collected next day!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <strong>James T.</strong>
                  <span>Birmingham</span>
                </div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I was worried about the paperwork but they explained everything clearly. DVLA notification was handled automatically."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div className="author-info">
                  <strong>Emma R.</strong>
                  <span>Leeds</span>
                </div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      <FreeQuoteCTA
        heading="Got Your Answers? Get Your Quote!"
        paragraph="Now that you know how our process works, find out what your car is worth. Get an instant, no-obligation quote and turn your old vehicle into cash today."
      />
    </div>
  );
};

export default FaqsPage;