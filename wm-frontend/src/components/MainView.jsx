import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Sidebar from './Sidebar.jsx';
import Board from './Board.jsx';
import Navbar from './Navbar.jsx';
import '../styles/MainView.css';

const MainView = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('/api/boards/list');
        const fetchedBoards = response.data || [];
        setBoards(fetchedBoards);

        if (fetchedBoards.length > 0 && !selectedBoard) {
          setSelectedBoard(fetchedBoards[0]);
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
        setError(error);
      }
    };

    fetchBoards();
  }, [selectedBoard]);

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
  };

  const handleAddBoard = async (newBoardName) => {
    const formData = new URLSearchParams();
    formData.append('name', newBoardName);
    formData.append('description', '');

    try {
      const response = await axios.post('/api/boards/create', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const newBoard = response.data;
      setBoards(prevBoards => [...prevBoards, newBoard]);
      setSelectedBoard(newBoard);
    } catch (error) {
      console.error('Error creating board:', error);
      setError('Error creating board. Please try again.');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await axios.delete(`/api/boards/delete/${boardId}`);
      setBoards(prevBoards => {
        const updatedBoards = prevBoards.filter(board => board.id !== boardId);
        if (selectedBoard && selectedBoard.id === boardId) {
          setSelectedBoard(updatedBoards.length > 0 ? updatedBoards[0] : null);
        }
        return updatedBoards;
      });
    } catch (error) {
      console.error('Error deleting board:', error);
      setError('Error deleting board. Please try again.');
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
    <div className="main">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar boards={boards} onBoardSelect={handleBoardSelect} onAddBoard={handleAddBoard} onDeleteBoard={handleDeleteBoard} />
        {selectedBoard ? (
            <Board board={selectedBoard} onBoardNameUpdate={handleBoardNameUpdate} />
          ) : (
            <div className="no-board-selected">Select a board to view its details</div>
          )}
      </div>
    </div>
  );
};

export default MainView;