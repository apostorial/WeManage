import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios-config.js';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Column from './Column';
import ColumnFormPopup from './ColumnFormPopup';
import '../styles/Board.css';
import addIcon from '../assets/add.svg';

const Board = ({ board, onBoardNameUpdate }) => {
  const columnsContainerRef = useRef(null);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [isBoardNameFocused, setIsBoardNameFocused] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [isAddColumnPopupOpen, setIsAddColumnPopupOpen] = useState(false);
  const [isEditColumnPopupOpen, setIsEditColumnPopupOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState(null);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  useEffect(() => {
    setBoardName(board.name);
  }, [board]);

  useEffect(() => {
    fetchColumns();
  }, [board.id]);

  useEffect(() => {
    setIsDragDisabled(isAddColumnPopupOpen || isEditColumnPopupOpen);
  }, [isAddColumnPopupOpen, isEditColumnPopupOpen]);

  const fetchColumns = async () => {
    try {
      const response = await axios.get(`/api/columns/board/${board.id}`);
      const columnsWithCards = await Promise.all(response.data.map(async (column) => {
        const cardsResponse = await axios.get(`/api/cards/column/${column.id}`);
        const processedCards = await Promise.all((cardsResponse.data || []).map(async (card) => {
          const labelPromises = card.labels.map(labelId => 
            axios.get(`/api/labels/${labelId}`)
          );
          const labelResponses = await Promise.all(labelPromises);
          const fullLabels = labelResponses.map(response => response.data);
          return { ...card, labels: fullLabels };
        }));
        return { ...column, cards: processedCards };
      }));
      setColumns(columnsWithCards);
    } catch (error) {
      console.error('Error fetching columns:', error);
      setError('Error loading columns. Please try again.');
    }
  };

  const addColumn = () => {
    setIsAddColumnPopupOpen(true);
  };

  const handleAddColumn = (newColumn) => {
    setColumns(prevColumns => [...prevColumns, { ...newColumn, cards: [] }]);
  };

  const closeAddColumnPopup = () => {
  setIsAddColumnPopupOpen(false);
  };

  const editColumn = (column) => {
    setColumnToEdit(column);
    setIsEditColumnPopupOpen(true);
  };
  
  const closeEditColumnPopup = () => {
    setIsEditColumnPopupOpen(false);
    setColumnToEdit(null);
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };
  
  const handleUpdateColumn = (updatedColumn) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === updatedColumn.id ? { ...col, ...updatedColumn } : col
      )
    );
  };

  const handleBoardNameChange = (e) => {
    setBoardName(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await updateBoardName();
      setIsBoardNameFocused(false);
      e.target.blur();
    }
  };

  const handleBoardNameFocus = () => {
    setIsBoardNameFocused(true);
  };

  const handleBoardNameBlur = async () => {
    await updateBoardName();
    setIsBoardNameFocused(false);
  };

  const updateBoardName = async () => {
    if (boardName.trim() === '') return;
    try {
      await axios.put(`/api/boards/update/${board.id}`, new URLSearchParams({ name: boardName }));
      setIsEditingBoardName(false);
      onBoardNameUpdate(board.id, boardName);
    } catch (error) {
      console.error('Error updating board name:', error);
      setError('Error updating board name. Please try again.');
    }
  };

  const handleColumnNameUpdate = (columnId, newName) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, name: newName } : col
      )
    );
  };

  const handleAddCard = (columnId, newCard) => {
    if (!newCard || !newCard.id) {
      console.error('New card is missing or has no id');
      return;
    }
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const handleUpdateCard = (columnId, updatedCard) => {
    setColumns(prevColumns =>
        prevColumns.map(col =>
            col.id === columnId
                ? {
                    ...col,
                    cards: col.cards.map(card =>
                        card.id === updatedCard.id ? updatedCard : card
                    )
                  }
                : col
        )
    );
};

const handleDeleteCard = (columnId, cardId) => {
  setColumns(prevColumns =>
      prevColumns.map(col =>
          col.id === columnId
              ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
              : col
      )
  );
};

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
  
    if (!destination) {
      return;
    }
  
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    if (type === 'column') {
      const newColumnOrder = Array.from(columns);
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);
  
      setColumns(newColumnOrder);
  
      try {
        await axios.put(`/api/boards/${board.id}/reorder-columns`, newColumnOrder.map(col => col.id));
      } catch (error) {
        console.error('Error reordering columns:', error);
        setError('Error reordering columns. Please try again.');
      }
    } else {
      const sourceColumn = columns.find(col => col.id === source.droppableId);
      const destColumn = columns.find(col => col.id === destination.droppableId);
      const draggedCard = sourceColumn.cards.find(card => card.id === draggableId);
  
      if (source.droppableId === destination.droppableId) {
        const newCards = Array.from(sourceColumn.cards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, draggedCard);
  
        const newColumn = {
          ...sourceColumn,
          cards: newCards,
        };
  
        const newColumns = columns.map(col =>
          col.id === newColumn.id ? newColumn : col
        );
  
        setColumns(newColumns);
  
        try {
          await axios.put(`/api/columns/${sourceColumn.id}/reorder-cards`, newCards.map(card => card.id));
        } catch (error) {
          console.error('Error reordering cards:', error);
          setError('Error reordering cards. Please try again.');
        }
      } else {
        const sourceCards = Array.from(sourceColumn.cards);
        sourceCards.splice(source.index, 1);
        const newSourceColumn = {
          ...sourceColumn,
          cards: sourceCards,
        };
  
        const destCards = Array.from(destColumn.cards);
        destCards.splice(destination.index, 0, draggedCard);
        const newDestColumn = {
          ...destColumn,
          cards: destCards,
        };
  
        const newColumns = columns.map(col =>
          col.id === newSourceColumn.id ? newSourceColumn :
          col.id === newDestColumn.id ? newDestColumn : col
        );
  
        setColumns(newColumns);
  
        try {
          await axios.put(`/api/cards/move/${draggableId}/column/${destination.droppableId}`);
  
          await axios.put(`/api/columns/${destination.droppableId}/reorder-cards`, 
            destCards.map(card => card.id)
          );
        } catch (error) {
          console.error('Error moving or reordering card:', error);
          setError('Error updating card position. Please try again.');
          setColumns(columns);
        }
      }
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="board">
      <div className="breadcrumb">
        <div className="breadcrumb-main">Main</div>
        <svg className='breadcrumb-icon' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.94043 13.2801L10.2871 8.93343C10.8004 8.42009 10.8004 7.58009 10.2871 7.06676L5.94043 2.72009" stroke="#EBF7FB" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="breadcrumb-boards">Boards</div>
      </div>
      <div className="board-header">
        <div className="board-title-section">
          <input
              type="text"
              value={boardName}
              onChange={handleBoardNameChange}
              onKeyDown={handleKeyDown}
              onFocus={handleBoardNameFocus}
              onBlur={handleBoardNameBlur}
              className="board-name-input"
              placeholder={board.name}
              size={boardName.length}
          />
        </div>
        <div className="board-actions">
          <button onClick={addColumn} className="add-new-parent">
            <div className="add-new">Add new</div>
            <img className="add-icon" alt="Add Icon" src={addIcon} />
          </button>
          <div className="options-button">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="vuesax/linear/more-square">
              <g id="more-square">
              <path id="Vector" d="M11.9993 29.3333H19.9993C26.666 29.3333 29.3327 26.6666 29.3327 20V12C29.3327 5.33329 26.666 2.66663 19.9993 2.66663H11.9993C5.33268 2.66663 2.66602 5.33329 2.66602 12V20C2.66602 26.6666 5.33268 29.3333 11.9993 29.3333Z" stroke="#EBF7FB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_2" d="M21.3293 16H21.3412" stroke="#EBF7FB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_3" d="M15.9933 16H16.0053" stroke="#EBF7FB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_4" d="M10.6593 16H10.6713" stroke="#EBF7FB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      {/* <p>{board.description}</p> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={(el) => {
              provided.innerRef(el);
              columnsContainerRef.current = el;
            }}  className="columns-container">
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Column
                            key={column.id}
                            column={column}
                            onColumnNameUpdate={handleColumnNameUpdate}
                            onDeleteColumn={handleDeleteColumn}
                            onAddCard={handleAddCard}
                            onUpdateCard={handleUpdateCard}
                            onDeleteCard={handleDeleteCard}
                            onEditColumn={editColumn}
                            setIsDragDisabled={setIsDragDisabled}
                        />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {(isAddColumnPopupOpen || isEditColumnPopupOpen) && (
        <ColumnFormPopup
          onClose={isAddColumnPopupOpen ? closeAddColumnPopup : closeEditColumnPopup}
          onSubmit={isAddColumnPopupOpen ? handleAddColumn : handleUpdateColumn}
          boardId={board.id}
          editColumn={columnToEdit}
        />
      )}
    </div>
  );
};

export default Board;