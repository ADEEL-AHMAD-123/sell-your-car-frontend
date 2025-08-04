import { useState } from 'react';

const faqs = [
  {
    question: 'How do I get an instant quote for my car?',
    answer: `Getting your car valued is simple:
- Enter your registration number
- Confirm vehicle details
- Get instant quote in seconds
- Book free collection if you accept

Our automated system uses real-time market data for accurate pricing.`
  },
  {
    question: 'What if the automatic quote seems too low?',
    answer: `If you think your car is worth more:
- Request a manual quote review
- Upload photos of your vehicle
- Provide additional details about condition
- Our experts will reassess within 24-48 hours

You can also provide your own estimated value for consideration.`
  },
  {
    question: 'What documents do I need to sell my car?',
    answer: `Required documents:
- V5C logbook (registration document)
- Valid ID (driving licence or passport)
- MOT certificate (if applicable)
- Service history (optional but helpful)

We'll handle all DVLA paperwork for you during collection.`
  },
  {
    question: 'What happens if I don\'t have my V5C logbook?',
    answer: `No V5C? No problem:
- You can still get a quote and sell your car
- We'll help you inform DVLA properly
- May need additional ID verification
- Process might take slightly longer

Apply for a replacement V5C from DVLA if you have time.`
  },
  {
    question: 'Is car collection really free?',
    answer: `Yes, absolutely free:
- No hidden collection fees
- No transport charges
- No administration costs
- Available nationwide

We even collect from most locations including your home, work, or roadside.`
  },
  {
    question: 'What types of cars do you buy?',
    answer: `We buy virtually any car:
- Running or non-running vehicles
- MOT failures and accident damaged
- High mileage and old cars
- Flood damaged vehicles
- Commercial vans and motorcycles
- Any make, model, age, or condition`
  },
  {
    question: 'How quickly can you collect my car?',
    answer: `Fast collection service:
- Same day collection available
- Usually within 24-48 hours
- Flexible time slots including weekends
- Emergency collections for urgent cases

Book online and choose your preferred collection time.`
  },
  {
    question: 'When and how do I get paid?',
    answer: `Quick payment options:
- Bank transfer (same day)
- Cash on collection
- Cheque (if preferred)

Payment confirmed before our driver leaves. No waiting around for funds to clear.`
  },
  {
    question: 'What if I change my mind after accepting?',
    answer: `We understand plans change:
- Cancel anytime before collection
- No cancellation fees
- Easy rebooking if you change your mind
- Customer service team available to help

Your quote remains valid for a reasonable period.`
  },
  {
    question: 'Do you buy cars on finance or with outstanding loans?',
    answer: `Yes, we can help:
- We'll contact your finance company
- Handle settlement figure negotiations
- Pay off your loan directly
- Give you any remaining balance

Just provide your finance company details when booking.`
  }
];

const ScrapGuideSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="scrap-guide" style={{
      padding: '60px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h2 className="section-title" style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2c3e50',
          marginBottom: '3rem'
        }}>
          Frequently Asked Questions
        </h2>
        <div className="accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
              style={{
                marginBottom: '1rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                className="accordion-question"
                onClick={() => toggle(index)}
                style={{
                  width: '100%',
                  padding: '20px 25px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span>{faq.question}</span>
                <span 
                  className="accordion-icon"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    color: '#3534FF',
                    transition: 'transform 0.3s ease',
                    transform: activeIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                  }}
                >
                  +
                </span>
              </button>
              <div 
                className="accordion-answer"
                style={{
                  maxHeight: activeIndex === index ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ padding: '0 25px 20px 25px' }}>
                  {faq.answer.split('\n').map((line, i) => (
                    <p 
                      key={i} 
                      style={{
                        margin: i === 0 ? '0 0 8px 0' : '8px 0',
                        lineHeight: '1.6',
                        color: '#495057',
                        fontSize: '0.95rem'
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrapGuideSection;