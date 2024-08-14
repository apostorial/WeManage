import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import '../styles/Card.css';

const Card = ({ card, onClick}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (isPopupOpen) {
      fetchComments();
    }
  }, [isPopupOpen]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/card/${card.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
    const intervals = [
      { seconds: 31536000, label: 'year' },
      { seconds: 2592000, label: 'month' },
      { seconds: 86400, label: 'day' },
      { seconds: 3600, label: 'hour' },
      { seconds: 60, label: 'minute' },
      { seconds: 1, label: 'second' }
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(seconds / interval.seconds);
      
      if (count >= 1) {
        return count === 1 
          ? `1 ${interval.label} ago`
          : `${count} ${interval.label}s ago`;
      }
    }
  
    return 'just now';
  }

  return (
    <div className="cardheader-parent" onClick={onClick}>
      <div className="cardheader">
        <div className="card-name">{card.name}</div>
        <div className="card-date">{timeAgo(card.createdAt)}</div>
      </div>
      <div className="card-position">{card.position}</div>
      <div className="labels-container">
        {card.labels.map((label, index) => (
          <div
            key={label.id}
            className="label"
            style={{
              backgroundColor: label.color,
              left: `${8 + index * 42}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Card;