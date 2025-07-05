import './KeyBenefits.scss';
import { FaMoneyBillWave, FaCarCrash, FaRecycle, FaHandsHelping, FaClock, FaMapMarkedAlt } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaMoneyBillWave />,
    title: 'Best Price Guaranteed',
    description: 'Get the highest valuation for your scrap car instantly with no hidden fees.',
  },
  {
    icon: <FaCarCrash />,
    title: 'Any Condition Accepted',
    description: 'Damaged, non-runner, or MOT failure — we accept all types of vehicles.',
  },
  {
    icon: <FaRecycle />,
    title: 'Environmentally Friendly',
    description: 'We ensure your vehicle is recycled and disposed of responsibly.',
  },
  {
    icon: <FaHandsHelping />,
    title: 'Hassle-Free Process',
    description: 'Simple, fast, and transparent — from quote to collection.',
  },
  {
    icon: <FaClock />,
    title: 'Same Day Collection',
    description: 'We offer prompt and convenient same-day pick-up at your doorstep.',
  },
  {
    icon: <FaMapMarkedAlt />,
    title: 'Nationwide Coverage',
    description: 'We operate across the UK, no matter where you are located.',
  },
];

const KeyBenefits = () => {
  return (
    <section className="key-benefits">
      <div className="container">
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="section-subtitle">Discover the key benefits of using our scrap car service</p>
        <div className="benefits-grid">
          {benefits.map((item, index) => (
            <div className="benefit-card" key={index}>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;
