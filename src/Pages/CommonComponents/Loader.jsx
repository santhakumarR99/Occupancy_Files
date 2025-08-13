// Loader.js
import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../Components/Styles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
