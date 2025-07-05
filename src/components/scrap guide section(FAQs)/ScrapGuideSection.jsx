import { useState } from 'react';
import './ScrapGuideSection.scss';

const faqs = [
  {
    question: 'How much money can I get for scrapping my car?',
    answer: `How much you’ll get for your scrap car depends on factors like:
- Scrap metal market
- Make/model, size, age
- Removed parts
- Location of scrap yard

Avoid removing parts to get a better quote. Closer yards can offer better value.`,
  },
  {
    question: 'What documents do I need to scrap my car?',
    answer: `You’ll typically need:
- V5C logbook
- MOT certificate
- Service history
- SORN (if applicable)

It’s simpler than private selling. Hand over documents at pickup to speed up the process.`,
  },
  {
    question: 'What happens if I’ve lost my V5C?',
    answer: `You don’t need a V5C to scrap your car. Just prove you're the registered keeper. Inform the DVLA manually with:
- Reg number, make/model
- Sale date
- Scrap yard info

Still, getting a new V5C makes things smoother.`,
  },
  {
    question: 'How do you scrap your car for money?',
    answer: `If scrapping without parts:
- Remove number plate (if needed)
- Use an Authorised Treatment Facility
- Hand over V5C (keep yellow slip)
- Inform DVLA & get Certificate of Destruction

If keeping parts:
- Get SORN
- Remove parts before scrapping
- Inform DVLA as above`,
  },
  {
    question: 'What type of cars do we scrap?',
    answer: `We handle all kinds:
- MOT failures
- Damaged/non-runners
- Write-offs
- Flooded/junk cars
- Insurance or fleet vehicles
- UK & foreign registered`
  },
  {
    question: 'Free quote & No hidden charges',
    answer: `Just enter reg + postcode. No personal info needed. Our prices include all fees—so no surprise charges.`
  },
];

const ScrapGuideSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="scrap-guide">
      <div className="container">
        <h2 className="section-title">FAQs</h2>
        <div className="accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="accordion-question"
                onClick={() => toggle(index)}
              >
                {faq.question}
                <span className="accordion-icon">{activeIndex === index ? '-' : '+'}</span>
              </button>
              <div className="accordion-answer">
                {faq.answer.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrapGuideSection;
