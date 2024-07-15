// src/components/Board.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import Column from './Column';
import '../styles/Board.css';

const Board = ({ board }) => {
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="board">
      <h2>{board.name}</h2>
      <p>{board.description}</p>
      <div className="columns-container">
        {columns.map(column => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default Board;