import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card';
import CardFormPopup from './CardFormPopup';
import '../styles/Column.css';
import deleteIcon from '../assets/delete.svg'
import divider from '../assets/divider.svg'
import EmptyState from '../assets/empty_state.svg?react';
import AddIcon from '../assets/add.svg?react';

const Column = ({ column, onColumnNameUpdate, onDeleteColumn, onEditColumn, onAddCard, onUpdateCard, onDeleteCard}) => {
  const [columnName, setColumnName] = useState(column.name);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [isEditCardPopupOpen, setIsEditCardPopupOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [cards, setCards] = useState(column.cards || []);

  useEffect(() => {
    setColumnName(column.name);
    setCards(column.cards || []);
  }, [column.name, column.cards]);

  const addCard = () => {
    setIsAddCardPopupOpen(true);
  };

  const handleAddCard = (newCard) => {
    if (!newCard || !newCard.id) {
      console.error('New card is missing or has no id');
      return;
    }
    setCards(prevCards => [...prevCards, newCard]);
    onAddCard(column.id, newCard);
  };

  const closeAddCardPopup = () => {
  setIsAddCardPopupOpen(false);
  };

  const editCard = (card) => {
    setCardToEdit(card);
    setIsEditCardPopupOpen(true);
  };
  
  const closeEditCardPopup = () => {
    setIsEditCardPopupOpen(false);
    setCardToEdit(null);
  };

  const handleUpdateCard = (updatedCard, deletedCardId) => {
    if (deletedCardId) {
        setCards(prevCards => prevCards.filter(card => card.id !== deletedCardId));
        onDeleteCard(column.id, deletedCardId);
    } else if (updatedCard) {
        setCards(prevCards => {
            const newCards = prevCards.map(card =>
                card.id === updatedCard.id ? {...card, ...updatedCard} : card
            );
            return newCards;
        });
        onUpdateCard(column.id, updatedCard);
    }
};

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleDeleteColumn = async () => {
    try {
      await axios.delete(`/api/columns/delete/${column.id}`);
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
          <div className='label-color' style={{backgroundColor: column.color}}></div>
          <div className='to-do-text' onClick={() => onEditColumn(column)}>{columnName}</div>
          <div className='cards-counter' style={{color: column.color}}>
            <div className='cards-number'>{column.cards.length}</div>
          </div>
        </div>
        <div className='add-icon-parent'>
        <svg onClick={addCard} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8H12" stroke="#EBF7FB" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12V4" stroke="#EBF7FB" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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
            {column.cards.length === 0 ? (
              <div className="empty-state-container">
              <EmptyState />
            </div>
            ) : (
              column.cards.map((card, index) => (
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
                        onDeleteCard={handleDeleteCard}
                        onEditCard={editCard}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <img src={divider} alt="Divider" className="footer-divider" />
      <div className="add-new-button" id="addNewButton" onClick={addCard}>
        <AddIcon className='add-column-icon' />
        <div className="column-add-new">Add new</div>
			</div>

      {(isAddCardPopupOpen || isEditCardPopupOpen) && (
        <CardFormPopup
          onClose={isAddCardPopupOpen ? closeAddCardPopup : closeEditCardPopup}
          onSubmit={isAddCardPopupOpen ? handleAddCard : handleUpdateCard}
          columnId={column.id}
          editCard={cardToEdit}
        />
      )}
    </div>
  );
};

export default Column;