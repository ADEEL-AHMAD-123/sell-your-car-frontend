import './FaqsPage.scss';
import FaqSection from '../../components/scrap guide section(FAQs)/ScrapGuideSection';
import FreeQuoteCTA from '../../components/call to action banner/FreeQuoteCTA';
import HowItWorks from '../../components/how it works section/HowItWorks'
const FaqsPage = () => {
  return (
    <div className="faqs-page">
      <div className="faq-container">
        <FaqSection />
      </div>
      <HowItWorks/>

      <FreeQuoteCTA
        heading="Still have questions?"
        paragraph="Our team is here to help. Get in touch or request a quote now."
        buttonText="Get My Free Quote"
        className='cta-grey'
      />
    </div>
  );
};

export default FaqsPage;
