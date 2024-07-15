// src/components/Column.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Card from './Card';
import '../styles/Column.css';

const Column = ({ column }) => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');

  useEffect(() => {
    fetchCards();
  }, [column.id]);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cards/column/${column.id}`);
      setCards(response.data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Error loading cards. Please try again.');
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    const formData = new URLSearchParams();
    formData.append('name', newCardName);
    formData.append('columnId', column.id);

    try {
      const response = await axios.post('http://localhost:8080/api/cards/create', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      setCards([...cards, response.data]);
      setNewCardName('');
      setIsAddingCard(false);
    } catch (error) {
      console.error('Error creating card:', error);
      setError('Error creating card. Please try again.');
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.name}</h3>
        <button onClick={() => setIsAddingCard(true)} className="add-card-btn">+</button>
      </div>
      <div className="cards-container">
        {cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      {isAddingCard && (
        <form onSubmit={handleAddCard} className="add-card-form">
          <input
            type="text"
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            placeholder="Enter card name"
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsAddingCard(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Column;