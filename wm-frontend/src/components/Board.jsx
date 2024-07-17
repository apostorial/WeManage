import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
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
      <div className="columns-container">
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            onColumnNameUpdate={handleColumnNameUpdate}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
