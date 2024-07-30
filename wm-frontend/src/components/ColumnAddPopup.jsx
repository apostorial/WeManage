import React, { useState } from 'react';
import axios from '../axios-config.js';
import '../styles/ColumnAddPopup.css';

const ColumnAddPopup = ({ onClose, onAddColumn, boardId }) => {
    const [columnName, setColumnName] = useState('');
    const [selectedColor, setSelectedColor] = useState('null');
    const [error, setError] = useState(null);

    const handleAddColumn = async () => {
        if (columnName.trim() && selectedColor) {
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append('boardId', boardId);
                params.append('name', columnName.trim());
                params.append('color', selectedColor);

                const response = await axios.post('/api/columns/create', params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                onAddColumn(response.data);
                onClose();
            } catch (err) {
                setError('Failed to create column. Please try again.');
                console.error('Error creating column:', err);
            }
        }
    };
    
    const colors = ['#91cd56', '#34d1b2', '#01b0fd', '#8568f4', '#ae52d3', '#ec4ea5', '#fb8120', '#fac624', '#a9a9a9'];
  
    return (
        <div className="overlay" id="newListOverlay">
            <div className="new-list-popup">
                <div className="content">
                    <svg className="featured-icon" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="48" height="48" rx="24" fill="#22224C"/>
                        <rect x="4" y="4" width="48" height="48" rx="24" stroke="#1D1D2C" strokeWidth="8"/>
                        <path d="M37.6602 26.44L36.6802 30.62C35.8402 34.23 34.1802 35.69 31.0602 35.39C30.5602 35.35 30.0202 35.26 29.4402 35.12L27.7602 34.72C23.5902 33.73 22.3002 31.67 23.2802 27.49L24.2602 23.3C24.4602 22.45 24.7002 21.71 25.0002 21.1C26.1702 18.68 28.1602 18.03 31.5002 18.82L33.1702 19.21C37.3602 20.19 38.6402 22.26 37.6602 26.44Z" stroke="#3E43FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M31.0603 35.39C30.4403 35.81 29.6603 36.16 28.7103 36.47L27.1303 36.99C23.1603 38.27 21.0703 37.2 19.7803 33.23L18.5003 29.28C17.2203 25.31 18.2803 23.21 22.2503 21.93L23.8303 21.41C24.2403 21.28 24.6303 21.17 25.0003 21.1C24.7003 21.71 24.4603 22.45 24.2603 23.3L23.2803 27.49C22.3003 31.67 23.5903 33.73 27.7603 34.72L29.4403 35.12C30.0203 35.26 30.5603 35.35 31.0603 35.39Z" stroke="#3E43FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M28.6396 24.53L33.4896 25.76" stroke="#3E43FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M27.6602 28.4L30.5602 29.14" stroke="#3E43FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="text-and-supporting-text">
                    <div className="text">Create a new list</div>
                    <div className="supporting-text">Please enter a name and select a color for this list.</div>
                </div>
                {error && <div className="error-message">{error}</div>}
                    <div className="column-input-field">
                        <div className="input-with-label">
                            <div className="column-label">List name</div>
                            <input type="text" id="listNameInput" placeholder="e.g. In Review" className="newlist-input" required value={columnName} onChange={(e) => setColumnName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="column-input-field">
                    <div className="input-with-label">
                        <div className="column-label">Color</div>
                        <div className="colors">
                                    {colors.map((color, index) => (
                                        <div
                                            key={color}
                                            className={`color-${index + 1} ${selectedColor === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color, cursor: 'pointer'}}
                                            onClick={() => setSelectedColor(color)}
                                        ></div>
                                    ))}
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <div className="buttons">
                        <div className="button" onClick={onClose}>
                            <div className="button-base">
                                <div className="text2">Cancel</div>
                            </div>
                        </div>
                        <div className="button1">
                            <div className="button-base1" onClick={handleAddColumn }>
                                <div className="text3">Add list</div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    </div>
    );
  };

export default ColumnAddPopup;