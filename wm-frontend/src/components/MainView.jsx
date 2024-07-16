import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Sidebar from './Sidebar';
import Board from './Board';
import '../styles/MainView.css';

const MainView = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/boards/list');
        setBoards(response.data || []);
      } catch (error) {
        console.error('Error fetching boards:', error);
        setError(error);
      }
    };

    fetchBoards();
  }, []);

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
  };

  const handleAddBoard = async (newBoardName) => {
    const formData = new URLSearchParams();
    formData.append('name', newBoardName);
    formData.append('description', '');

    try {
      const response = await axios.post('http://localhost:8080/api/boards/create', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setBoards([...boards, response.data]);
    } catch (error) {
      console.error('Error creating board:', error);
      setError('Error creating board. Please try again.');
    }
  };

  const handleBoardNameUpdate = (boardId, newName) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, name: newName } : board
      )
    );
  };

  return (
    <div className="main-view">
      <Sidebar 
        boards={boards} 
        onBoardSelect={handleBoardSelect}
        onAddBoard={handleAddBoard}
      />
      {selectedBoard ? (
        <Board board={selectedBoard} onBoardNameUpdate={handleBoardNameUpdate} />
      ) : (
        <div className="no-board-selected">Select a board to view its details</div>
      )}
    </div>
  );
};

export default MainView;
