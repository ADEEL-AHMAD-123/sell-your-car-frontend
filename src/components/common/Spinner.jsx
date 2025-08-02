// components/common/Spinner.jsx
import React from 'react';
import './Spinner.scss';

const Spinner = ({ size = 40 }) => (
  <div className="spinner-container">
    <div className="spinner" style={{ width: size, height: size }} />
  </div>
);

export default Spinner;
