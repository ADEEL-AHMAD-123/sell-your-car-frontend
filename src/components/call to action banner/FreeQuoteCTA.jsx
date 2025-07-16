import PropTypes from 'prop-types';
import './FreeQuoteCTA.scss';

const FreeQuoteCTA = ({
  heading,
  paragraph,
  buttonText,
  buttonLink = "#quote",
  className = ''
}) => {
  return (
    <section className={`cta-section ${className}`}>
      <div className="container">
        <div className="cta-content">
          <h2>{heading}</h2>
          <p>{paragraph}</p>
          <a href={buttonLink} className="cta-button">{buttonText}</a>
        </div>
        <div className="cta-pattern" aria-hidden="true"></div>
      </div>
    </section>
  );
};

FreeQuoteCTA.propTypes = {
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string,
  className: PropTypes.string, 
};

export default FreeQuoteCTA;
