import './TrustSection.scss';
import { FaTruckMoving, FaBolt, FaRegComments, FaFileSignature } from 'react-icons/fa';

const trustPoints = [
  {
    title: 'Free Nationwide Pickup',
    icon: <FaTruckMoving />,
  },
  {
    title: 'Instant Online Quotes',
    icon: <FaBolt />,
  },
  {
    title: 'Custom Offers Available',
    icon: <FaRegComments />,
  },
  {
    title: 'DVLA Paperwork Sorted',
    icon: <FaFileSignature />,
  },
];

const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="container">
        <h2>Why Thousands Trust Us</h2>
        <div className="trust-grid">
          {trustPoints.map((item, i) => (
            <div className="trust-card" key={i}>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
