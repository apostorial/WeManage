// src/components/Card.jsx
import React from 'react';
import '../styles/Card.css';

const Card = ({ card }) => {
  return (
    <div className="card-column">
      <h4>{card.name}</h4>
    </div>
  );
};

export default Card;