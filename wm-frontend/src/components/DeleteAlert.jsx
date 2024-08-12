import React, { useState } from 'react';
import '../styles/DeleteAlert.css';
import TrashIcon from "../assets/trash_icon.svg?react"

const DeleteAlert = ({ onCancel, onDelete, itemName }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className='alert-main-container'>
            <div className="alert-container">
                <div className="alert-content">
                    <TrashIcon className='alert-content-icon-container' />
                    <div className="alert-content-text">
                        <div className="alert-content-main-text">Delete {itemName}</div>
                        <div className="alert-content-secondary-text">Are you sure you want to delete this {itemName}? <br/>This action cannot be undone.</div>
                    </div>
                </div>
                <div className="alert-actions">
                    <div 
                        className="alert-actions-button" 
                        onClick={onCancel}>
                        <div className="alert-actions-button-text">Cancel</div>
                    </div>
                    <div 
                        className="alert-actions-button1" 
                        onClick={onDelete}
                        disabled={isDeleting}>
                        <div className="alert-actions-button-text">Delete</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAlert;