import React, { useState } from 'react';
import axios from '../axios-config.js';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import '../styles/Column.css';

const Column = ({ column, onColumnNameUpdate, onDeleteColumn, onAddCard, onUpdateCard, onDeleteCard }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [isEditingColumnName, setIsEditingColumnName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    try {
      const response = await axios.post('http://localhost:8080/api/cards/create', new URLSearchParams({
        name: newCardName,
        columnId: column.id,
      }));
      onAddCard(column.id, response.data);
      setNewCardName('');
      setIsAddingCard(false);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const updateColumnName = async () => {
    try {
      await axios.put(`http://localhost:8080/api/columns/update/${column.id}`, new URLSearchParams({ name: columnName }));
      setIsEditingColumnName(false);
      onColumnNameUpdate(column.id, columnName);
    } catch (error) {
      console.error('Error updating column name:', error);
    }
  };

  return (
    <div className="column">
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
        <button onClick={() => onDeleteColumn(column.id)} className="delete-column-btn">Delete</button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="cards-container">
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card
                      key={card.id}
                      card={card}
                      onUpdate={(updatedCard) => onUpdateCard(column.id, card.id, updatedCard)}
                      onDelete={() => onDeleteCard(column.id, card.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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