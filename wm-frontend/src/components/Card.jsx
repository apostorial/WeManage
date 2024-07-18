import React, { useState } from 'react';
import axios from '../axios-config.js';
import '../styles/Card.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Card = ({ card, onUpdate, column }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: card.name || '',
    company: card.company || '',
    position: card.position || '',
    email: card.email || '',
    number: card.number || '',
    website: card.website || '',
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    setIsPopupOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsPopupOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams({
        id: card.id,
        name: formData.name,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        number: formData.number,
        website: formData.website,
        columnId: column,
      });

      const response = await axios.put(`http://localhost:8080/api/cards/update/${card.id}`,
        payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.status === 200) {
        onUpdate(card.id, formData);
        setIsPopupOpen(false);
      } else {
        console.error('Failed to update card');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/cards/delete/${card.id}`);
      if (response.status === 204) {
        onUpdate(card.id, null);
        setIsPopupOpen(false);
      } else {
        console.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card-column"
      onClick={handleClick}
    >
      <h4>{card.name}</h4>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Update Card</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" />
              <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Number" />
              <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
              <button type="submit">Update</button>
              <button type="button" onClick={handleClose}>Cancel</button>
              <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;