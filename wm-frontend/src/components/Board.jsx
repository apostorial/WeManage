import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Column from './Column';
import '../styles/Board.css';
import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay} from '@dnd-kit/core';
import {SortableContext, horizontalListSortingStrategy, arrayMove} from '@dnd-kit/sortable';

const Board = ({ board, onBoardNameUpdate }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setBoardName(board.name);
  }, [board]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/columns/board/${board.id}`);
        setColumns(response.data || []);
      } catch (error) {
        console.error('Error fetching columns:', error);
        setError('Error loading columns. Please try again.');
      }
    };
  
    fetchColumns();
  }, [board.id]);

  const addColumn = async () => {
    if (!newColumnName) return;

    try {
      const response = await axios.post('http://localhost:8080/api/columns/create', new URLSearchParams({
        boardId: board.id,
        name: newColumnName,
      }));

      setColumns([...columns, response.data]);
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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
  
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumns(newColumns);
  
      const columnIds = newColumns.map((col) => col.id);
  
      try {
        await axios.put(`http://localhost:8080/api/boards/${board.id}/reorder-columns`, columnIds);
      } catch (error) {
        console.error('Error reordering columns:', error);
        console.log("Error response:", error.response);
        setError('Error reordering columns. Please try again.');
      }
    }
  
    setActiveId(null);
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
          <span onClick={() => setIsEditingBoardName(true)} className="board-name">{boardName}</span>
        )}
        <button onClick={() => setIsInputVisible(true)} className="add-column-button">+</button>
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
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
          <div className="columns-container">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onColumnNameUpdate={handleColumnNameUpdate}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <Column
              column={columns.find((col) => col.id === activeId)}
              onColumnNameUpdate={handleColumnNameUpdate}
              onDeleteColumn={handleDeleteColumn}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;