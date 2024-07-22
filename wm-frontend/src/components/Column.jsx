import React, { useState } from 'react';
import axios from '../axios-config.js';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import '../styles/Column.css';
import addIcon from '../assets/add.svg'
import deleteIcon from '../assets/delete.svg'
import divider from '../assets/divider.svg'

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

  const handleDeleteColumn = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/columns/delete/${column.id}`);
      onDeleteColumn(column.id);
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCard(e);
    }
  };

  return (
    <div className="to-do-list">
      <div className="todo-header">
        <div className='todo-label'>
          <div className='label-color'></div>
          <div className='to-do-text'>{columnName}</div>
          <div className='cards-counter'>
            <div className='cards-number'>{column.cards.length}</div>
          </div>
        </div>
        <div className='add-icon-parent'>
          <img src={addIcon} alt="Add Icon" className="add-icon" />
          <img src={deleteIcon} alt="Delete Icon" className="delete-icon" onClick={handleDeleteColumn}/>
        </div>
      </div>
      <img src={divider} alt="Divider" className="header-divider" />
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`card-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            style={{ minHeight: '50px' }}
          >
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      key={card.id}
                      card={card}
                      onUpdate={(updatedCard) => onUpdateCard(column.id, updatedCard)}
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
      <img src={divider} alt="Divider" className="footer-divider" />
      <div className="add-new-button" id="addNewButton">
        {/* <img src={addIcon} alt="Add Icon" className="add-icon" /> */}
				<div className="add-new">
          <a href="" className="board-option add-new" onClick={handleAddCard}>
            <img src={addIcon} alt="Card Add Icon" className="add-icon-input" />
            <input
              type="text"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              placeholder="Add a new card"
              onKeyDown={handleKeyDown}
            />
          </a>
        </div>
			</div>
    </div>
  );
};

export default Column;