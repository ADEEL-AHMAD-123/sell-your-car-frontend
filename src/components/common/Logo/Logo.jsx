// Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../../../public/logo.jpeg'; 
import './Logo.scss';

const Logo = ({ className = '' }) => {
  return (
    <div className={`logo ${className}`}>
      <Link to="/" className="logo__link">
        <img src={logoImage} alt="Sell Your Car" className="logo__image" />
      </Link>
    </div>
  );
};

export default Logo;