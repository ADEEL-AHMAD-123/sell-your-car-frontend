// Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import './Logo.scss';

const Logo = ({ className = '' }) => {
  return (
    <div className={`logo ${className}`}>
      <Link to="/" className="logo__link">
        <div className="logo__icon">
          <FontAwesomeIcon icon={faCar} />
        </div>
        <div className="logo__text">
          <span className="logo__main">SellYourCar</span>
          <span className="logo__tagline">Quick • Fair • Trusted</span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;