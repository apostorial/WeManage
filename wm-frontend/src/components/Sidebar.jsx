import React, { useState } from 'react';
import '../styles/Sidebar.css';
import logo from '../assets/Logo.png';

const Sidebar = ({ boards, onBoardSelect, onAddBoard, onDeleteBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');

  const handleAddBoard = () => {
    if (!newBoardName.trim()) return;
    onAddBoard(newBoardName);
    setNewBoardName('');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="board-list">
        {Array.isArray(boards) && boards.length > 0 ? (
          boards.map((board) => (
            <div key={board.id} className="board-item">
              <button 
                className="board-button"
                onClick={() => onBoardSelect(board)}
              >
                {board.name}
              </button>
              <button 
                className="delete-board-button" 
                onClick={() => onDeleteBoard(board.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div>No boards available.</div>
        )}
      </div>
      <div className="add-board">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter board name"
        />
        <button onClick={handleAddBoard}>Add Board</button>
      </div>
    </div>
  );
};

export default Sidebar;
