import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import '../styles/Card.css';

const Card = ({ card, onUpdate, onDelete }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: card.name || '',
    company: card.company || '',
    position: card.position || '',
    email: card.email || '',
    number: card.number || '',
    website: card.website || '',
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    if (isPopupOpen) {
      fetchComments();
    }
  }, [isPopupOpen]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/card/${card.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleClick = () => {
    setIsPopupOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsPopupOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
    const intervals = [
      { seconds: 31536000, label: 'year' },
      { seconds: 2592000, label: 'month' },
      { seconds: 86400, label: 'day' },
      { seconds: 3600, label: 'hour' },
      { seconds: 60, label: 'minute' },
      { seconds: 1, label: 'second' }
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(seconds / interval.seconds);
      
      if (count >= 1) {
        return count === 1 
          ? `1 ${interval.label} ago`
          : `${count} ${interval.label}s ago`;
      }
    }
  
    return 'just now';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams({
        id: card.id,
        name: formData.name,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        number: formData.number,
        website: formData.website,
        labelIds: '',
      });

      const response = await axios.put(`http://localhost:8080/api/cards/update/${card.id}`,
        payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.status === 200) {
        onUpdate(response.data);
        setIsPopupOpen(false);
      } else {
        console.error('Failed to update card');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/cards/delete/${card.id}`);
      if (response.status === 204) {
        onDelete(card.id);
        setIsPopupOpen(false);
      } else {
        console.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams({
        content: newComment,
        cardId: card.id
      });
  
      const response = await axios.post('http://localhost:8080/api/comments/create', 
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.status === 201) {
        setComments([...comments, response.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async () => {
    try {
      const payload = new URLSearchParams({
        content: editingCommentContent,
        id: editingCommentId
      });

      const response = await axios.put(`http://localhost:8080/api/comments/update/${editingCommentId}`, 
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.status === 200) {
        const updatedComments = comments.map(c => 
          c.id === editingCommentId ? response.data : c
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        setEditingCommentContent('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/comments/delete/${commentId}`);
      if (response.status === 204) {
        const updatedComments = comments.filter(c => c.id !== commentId);
        setComments(updatedComments);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  return (
    <div className="cardheader-parent">
      <div className="cardheader">
        <div className="card-name">{card.name}</div>
        <div className="card-date">{timeAgo(card.createdAt)}</div>
      </div>
      <div className="card-position">{card.position}</div>
      <div className="labels-container">
        {card.labels.map((label, index) => (
          <div
            key={label.id}
            className="label"
            style={{
              backgroundColor: label.color,
              left: `${8 + index * 42}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Card;