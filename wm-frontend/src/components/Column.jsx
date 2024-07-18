import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Card from './Card';
import '../styles/Column.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable';

const Column = ({ column, onColumnNameUpdate, onDeleteColumn, isDragging }) => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [isEditingColumnName, setIsEditingColumnName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    fetchCards();
  }, [column.id]);

  useEffect(() => {
    setColumnName(column.name);
  }, [column]);

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
          'Content-Type': 'application/x-www-form-urlencoded'
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

  const updateColumnName = async () => {
    try {
      await axios.put(`http://localhost:8080/api/columns/update/${column.id}`, new URLSearchParams({ name: columnName }));
      setIsEditingColumnName(false);
      onColumnNameUpdate(column.id, columnName);
    } catch (error) {
      console.error('Error updating column name:', error);
      setError('Error updating column name. Please try again.');
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/columns/delete/${column.id}`);
      onDeleteColumn(column.id);
    } catch (error) {
      console.error('Error deleting column:', error);
      setError('Error deleting column. Please try again.');
    }
  };

  const handleCardUpdate = (cardId, updatedData) => {
    if (updatedData === null) {
      setCards(cards.filter(card => card.id !== cardId));
    } else {
      setCards(cards.map(card => (card.id === cardId ? { ...card, ...updatedData } : card)));
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
  
      const newCards = arrayMove(cards, oldIndex, newIndex);
      setCards(newCards);
  
      const cardIds = newCards.map((card) => card.id);
  
      try {
        await axios.put(`http://localhost:8080/api/columns/${column.id}/reorder-cards`, cardIds);
      } catch (error) {
        console.error('Error reordering cards:', error);
        console.log("Error response:", error.response);
        setError('Error reordering cards. Please try again.');
      }
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="column">
      <div className="column-header">
        {isEditingColumnName ? (
          <input 
            type="text" 
            value={columnName} 
            onChange={(e) => setColumnName(e.target.value)} 
            onBlur={updateColumnName} 
            className="column-name-input" 
            autoFocus
          />
        ) : (
          <h3 onClick={() => setIsEditingColumnName(true)}>{columnName}</h3>
        )}
        <button onClick={() => setIsAddingCard(true)} className="add-card-btn">+</button>
        <button onClick={handleDeleteColumn} className="delete-column-btn">Delete</button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          <div className="cards-container">
            {cards.map((card) => (
              <Card key={card.id} card={card} onUpdate={handleCardUpdate} column={column.id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
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