import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Column from './Column';
import '../styles/Board.css';
import moreIcon from '../assets/more.svg';

const Board = ({ board, onBoardNameUpdate }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [boardName, setBoardName] = useState(board.name);

  useEffect(() => {
    setBoardName(board.name);
  }, [board]);

  useEffect(() => {
    fetchColumns();
  }, [board.id]);

  const fetchColumns = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/columns/board/${board.id}`);
      const columnsWithCards = await Promise.all(response.data.map(async (column) => {
        const cardsResponse = await axios.get(`http://localhost:8080/api/cards/column/${column.id}`);
        const processedCards = await Promise.all((cardsResponse.data || []).map(async (card) => {
          const labelPromises = card.labels.map(labelId => 
            axios.get(`http://localhost:8080/api/labels/${labelId}`)
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

  const addColumn = async () => {
    const defaultName = `Column ${columns.length + 1}`;

    try {
      const response = await axios.post('http://localhost:8080/api/columns/create', new URLSearchParams({
        boardId: board.id,
        name: defaultName,
      }));

      setColumns([...columns, { ...response.data, cards: [] }]);
    } catch (error) {
      console.error('Error creating column:', error);
      setError('Error creating column. Please try again.');
    }
  };

  const handleBoardNameChange = (e) => {
    setBoardName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateBoardName();
    }
  };

  const showBoardNameInput = () => {
    setIsEditingBoardName(true);
  };

  const updateBoardName = async () => {
    if (boardName.trim() === '') return;
    try {
      await axios.put(`http://localhost:8080/api/boards/update/${board.id}`, new URLSearchParams({ name: boardName }));
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

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleAddCard = (columnId, newCard) => {
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
        await axios.put(`http://localhost:8080/api/boards/${board.id}/reorder-columns`, newColumnOrder.map(col => col.id));
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
          await axios.put(`http://localhost:8080/api/columns/${sourceColumn.id}/reorder-cards`, newCards.map(card => card.id));
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
          await axios.put(`http://localhost:8080/api/cards/move/${draggableId}/column/${destination.droppableId}`);
  
          await axios.put(`http://localhost:8080/api/columns/${destination.droppableId}/reorder-cards`, 
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
      <div className="board-header">
      <div className="board-title-section">
      {isEditingBoardName ? (
            <div className="add-new-button" id="editBoardName">
              <div className="add-new">
                <a href="#" className="board-option add-new" onClick={updateBoardName}>
                  <input
                    type="text"
                    value={boardName}
                    onChange={handleBoardNameChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter board name"
                    autoFocus
                  />
                </a>
              </div>
            </div>
          ) : (
            <span onClick={showBoardNameInput} className="board-name">
            {boardName}
          </span>
        )}
         </div>
         <div className="board-actions">
         <button onClick={addColumn} className="add-new-button">
            Add new +
          </button>
        <button className="options-button">
            <img src={moreIcon} alt="More options" />
          </button>
          </div>
          </div>
      <p>{board.description}</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="columns-container">
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
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
    </div>
  );
};

export default Board;