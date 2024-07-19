import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Column from './Column';
import '../styles/Board.css';

const Board = ({ board, onBoardNameUpdate }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
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
        return { ...column, cards: cardsResponse.data || [] };
      }));
      setColumns(columnsWithCards);
    } catch (error) {
      console.error('Error fetching columns:', error);
      setError('Error loading columns. Please try again.');
    }
  };

  const addColumn = async () => {
    if (!newColumnName) return;

    try {
      const response = await axios.post('http://localhost:8080/api/columns/create', new URLSearchParams({
        boardId: board.id,
        name: newColumnName,
      }));

      setColumns([...columns, { ...response.data, cards: [] }]);
      setNewColumnName('');
      setIsInputVisible(false);
    } catch (error) {
      console.error('Error creating column:', error);
      setError('Error creating column. Please try again.');
    }
  };

  const updateBoardName = async () => {
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
      <h2>
        {isEditingBoardName ? (
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={updateBoardName}
            className="board-name-input"
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditingBoardName(true)} className="board-name">
            {boardName}
          </span>
        )}
        <button onClick={() => setIsInputVisible(true)} className="add-column-button">
          +
        </button>
      </h2>
      {isInputVisible && (
        <div className="input-container">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Column name"
            className="column-input"
          />
          <button onClick={addColumn}>Create</button>
        </div>
      )}
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