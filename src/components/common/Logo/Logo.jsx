// src/components/Logo/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../../../../public/logo-light.jpeg'; // Assuming a light logo
import logoDark from '../../../../public/logo-dark.png';   // Assuming a dark logo
import './Logo.scss';

const Logo = ({ className = '', theme = 'light' }) => {
  // Select the logo based on the 'theme' prop
  const logoImage = theme === 'dark' ? logoDark : logoLight;

  return (
    <div className={`logo ${className}`}>
      <Link to="/" className="logo__link">
        <img src={logoImage} alt="Sell Your Car" className="logo__image" />
      </Link>
    </div>
  );
};

export default Logo;