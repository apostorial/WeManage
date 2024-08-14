import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios-config.js';
import '../styles/CardSheet.css';
import CardIcon from '../assets/card_icon.svg?react';
import NameIcon from '../assets/user.svg?react';
import CompanyIcon from '../assets/building.svg?react';
import PositionIcon from '../assets/briefcase.svg?react';
import EmailIcon from '../assets/sms.svg?react';
import PhoneIcon from '../assets/call.svg?react';
import WebsiteIcon from '../assets/global.svg?react';
import DateIcon from '../assets/calendar_2.svg?react';
import LabelIcon from '../assets/label_icon.svg?react';
import AttachmentIcon from '../assets/attachment_icon.svg?react';
import CommentIcon from '../assets/comment_icon.svg?react';
import DividerIcon from '../assets/sheet_divider.svg?react';
import CloseIcon from '../assets/close_icon.svg?react';
import FileIcon from '../assets/file_icon.svg?react';
import TrashIcon from '../assets/trash.svg?react';
import DeleteAlert from './DeleteAlert';

const CardSheet = ({ card, onClose, onDelete, onEdit }) => {
    const [user, setUser] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(card.comments || []);
    const [fileDetails, setFileDetails] = useState(null);
    const sheetRef = useRef(null);
    const deleteAlertRef = useRef(null);

    const sortComments = (commentsToSort) => {
        return [...commentsToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (sheetRef.current && !sheetRef.current.contains(event.target) &&
                deleteAlertRef.current && !deleteAlertRef.current.contains(event.target) &&
                !showDeleteAlert) {
                onClose();
            }
        };
    
        document.addEventListener('mousedown', handleOutsideClick);
    
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose, showDeleteAlert]);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get('/api/user/me');
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        const fetchFileDetails = async () => {
            if (card.file) {
                try {
                    const response = await axios.get(`/api/files/card/${card.id}/filename`);
                    setFileDetails(response.data);
                } catch (error) {
                    console.error('Error fetching file details:', error);
                }
            }
        };
    
        fetchUserData();
        fetchFileDetails();
      }, []);

    const handleDeleteClick = () => {
        setShowDeleteAlert(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/api/cards/delete/${card.id}`);
            onDelete(card.id);
            onClose();
        } catch (err) {
            console.error('Error deleting card:', err);
            setError('Failed to delete card. Please try again.');
        }
        setShowDeleteAlert(false);
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const payload = new URLSearchParams();
            payload.append('cardId', card.id);
            payload.append('content', newComment.trim());

            const response = await axios.post('/api/comments/create', payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data) {
                const updatedComments = sortComments([...comments, response.data]);
                setComments(updatedComments);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDownload = async () => {
        try {
          const response = await axios.get(`/api/files/download/card/${card.id}`, {
            responseType: 'blob'
          });
    
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
    
          const filename = fileDetails.replace(/\.pdf$/i, '');
    
          const url = window.URL.createObjectURL(blob);
    
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
    
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading the file:", error);
        }
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        };
        return date.toLocaleString('en-US', options);
      };

    return (
        <div className="sheet-main-container">
            <div className="sheet-container" ref={sheetRef}>
                <div className="sheet-header-container">
                    <div className="sheet-header">
                        <div className="sheet-header-card-icon-container">
                            <CardIcon className='sheet-header-card-icon'/>
                        </div>
                        <div className="sheet-header-text-container">
                            <div className="sheet-header-text">Card details</div>
                        </div>
                    </div>

                    <div className="sheet-header-cross-icon-container" onClick={onClose}>
                        <div className="sheet-header-cross-icon-nested">
                            <CloseIcon className='sheet-header-cross-icon' />
                        </div>
                    </div>
                    <div className=''>
                    <DividerIcon className='sheet-header-divider-icon'/>
                    </div>
                </div>
                <div className="sheet-body-container">
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <NameIcon className='sheet-body-item-icon'/>
                            <div className="sheet-body-item-label-text1">Full name:</div>
                        </div>
                        <div className="sheet-body-item-text">{card.name}</div>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <CompanyIcon className='sheet-body-item-icon' />
                            <div className="sheet-body-item-label-text1">Company:</div>
                        </div>
                        <div className="sheet-body-item-text">{card.company}</div>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <PositionIcon className='sheet-body-item-icon' />
                            <div className="sheet-body-item-label-text1">Position:</div>
                        </div>
                        <div className="sheet-body-item-text">{card.position}</div>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <EmailIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text1">Email address:</div>
                        </div>
                        <div className="sheet-body-item-text">{card.email}</div>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <PhoneIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text1">Phone number:</div>
                        </div>
                        <div className="sheet-body-item-text">{card.number}</div>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <WebsiteIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text1">Website:</div>
                        </div>
                            <a href={card.website} target='_blank'>
                                <div className="sheet-body-item-text5">{card.website}</div>
                            </a>
                    </div>
                    <div className="sheet-body-item-container1">
                        <div className="sheet-body-item-label1">
                            <DateIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text1">Meeting date:</div>
                        </div>
                            <a href={card.meetingLink} target='_blank'>
                                <div className="sheet-body-item-text5">{formatDate(card.meeting)}</div>
                            </a>
                    </div>
                    <div className="sheet-body-labels-container">
                        <div className="sheet-body-item-label1">
                            <LabelIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text1">Labels:</div>
                        </div>
                        <div className="sheet-labels-container">
                            {card.labels && card.labels.map(label => (
                                <div key={label.id} className='card-label' style={{backgroundColor: `${label.color}33`,}}>
                                <div  key={label.id} className="card-label-text" style={{color: label.color}}>
                                    {label.name}
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sheet-body-attachments-contain">
                        <div className="sheet-body-item-label">
                            <AttachmentIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text">Attachments:</div>
                        </div>
                        {fileDetails && (
                            <div key={card.file.id} className="sheet-body-item-text7">
                                <FileIcon className='file-upload-icon' />
                                <div className="text-and-supporting-text">
                                    <div className="file-name">{fileDetails ? fileDetails : 'Attached File'}</div>
                                    <div className="supporting-text-parent">
                                        <div className="supporting-text">{fileDetails.split('.').pop().toUpperCase()}</div>
                                        <div className="supporting-text">•</div>
                                        <div className="supporting-text file-download" onClick={handleDownload}>Download</div>
                                    </div>
                                </div>
                            </div>
                            )}
                    </div>
                </div>
                <div className="sheet-secondary-body-container">
                    <div className="sheet-body-item-container">
                        <div className="sheet-body-item-label">
                            <CommentIcon className='sheet-footer-button-icon' />
                            <div className="sheet-body-item-label-text">Comments:</div>
                        </div>
                        <div className="sheet-body-item-input-container">
                            <div className="sheet-body-item-input-nested-container">
                                <textarea className='sheet-body-item-input' placeholder='Type something here...' value={newComment} onChange={handleCommentChange}/>
                                <div className="sheet-body-item-button" onClick={handleCommentSubmit}>
                                    <div className="sheet-body-item-button-text">Publish</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sheet-body-comment-container">
                        {sortComments(comments).map((comment, index) => (
                            <div key={index} className="sheet-body-comment-item-contai">
                                <div className="sheet-body-comment-item-header">
                                    <div className="sheet-body-comment-item-nested">
                                        {user && user.picture ? (
                                            <img src={user.picture} className="sheet-body-comment-item-icon" />
                                        ) : (
                                            <div className="sheet-body-comment-item-icon"></div>
                                        )}
                                        <div className="sheet-body-item-button-text">{user ? user.name : 'Unknown'}</div>
                                    </div>
                                    <div className="sheet-body-comment-item-suppor">•</div>
                                    <div className="sheet-body-comment-item-date">{timeAgo(comment.createdAt)}</div>
                                </div>
                                <div className="sheet-body-comment-item-content">
                                    <div className='sheet-body-comment-item-content-text'>{comment.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="sheet-footer-container">
                <div className="sheet-footer-divider-container">
                    <DividerIcon className='sheet-footer-divider-icon'/>
                </div>
                    <div className="sheet-footer-action-container">
                        <div className="sheet-footer-action-buttons">
                            <div className="sheet-footer-button" onClick={handleDeleteClick}>
                                <div className="sheet-footer-button-base trash-button">
                                    <TrashIcon className='' />
                                    <div className="sheet-footer-button-text">Delete</div>
                                </div>
                            </div>
                            <div className="sheet-footer-button1" onClick={onEdit}>
                                <div className="sheet-footer-button-base1">
                                    <div className="sheet-body-item-button-text">Edit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {showDeleteAlert && (
            <div ref={deleteAlertRef}>
                <DeleteAlert 
                    onCancel={handleCancelDelete}
                    onDelete={handleConfirmDelete}
                    itemName="card"
                />
            </div>
        )}
        </div>
    );
};

export default CardSheet;