import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios-config.js';
import '../styles/LabelPopup.css';
import ArrowDownIcon from '../assets/arrow_down_label.svg?react';
import PlusIcon from '../assets/plus_icon_container.svg?react';
import RemoveIcon from '../assets/remove_label_icon.svg?react';

const LabelPopup = ({ onClose, onAddLabels, initialLabels = [] }) => {
    const [availableLabels, setAvailableLabels] = useState([]);
    const [cardLabels, setCardLabels] = useState(initialLabels);
    const [labelInput, setLabelInput] = useState('');
    const [selectedColor, setSelectedColor] = useState('#91cd56');
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const colorDropdownRef = useRef(null);
    const labelPopupRef = useRef(null);
    const colorInputRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchAvailableLabels();
    }, []);

    const fetchAvailableLabels = async () => {
        try {
            const response = await axios.get('/api/labels/list');
            setAvailableLabels(response.data);
        } catch (error) {
            console.error('Error fetching labels:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorDropdownRef.current && 
                !colorDropdownRef.current.contains(event.target) &&
                !colorInputRef.current.contains(event.target)) {
                setIsColorDropdownOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddLabel = async () => {
        if (labelInput.trim()) {
            try {
                const formData = new FormData();
                formData.append('name', labelInput.trim());
                formData.append('color', selectedColor);
    
                const response = await axios.post('/api/labels/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                setAvailableLabels([...availableLabels, response.data]);
                setLabelInput('');
            } catch (error) {
                console.error('Error creating label:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setIsColorDropdownOpen(false);
    };

    const handleAddLabels = () => {
        onAddLabels(cardLabels);
        onClose();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleAvailableLabelClick = (label) => {
        if (!cardLabels.some(l => l.id === label.id)) {
            setCardLabels(prevLabels => [...prevLabels, label]);
        }
    };
    
    const handleDeleteAvailableLabel = async (labelId, event) => {
        event.stopPropagation();
        try {
            await axios.delete(`/api/labels/delete/${labelId}`);
            
            setAvailableLabels(prevLabels => {
                const updatedLabels = prevLabels.filter(label => label.id !== labelId);
                return updatedLabels;
            });

            setCardLabels(prevLabels => {
                const updatedLabels = prevLabels.filter(label => label.id !== labelId);
                return updatedLabels;
            });

        } catch (error) {
            console.error('Error deleting label:', error);
        }
    };

    const handleCardLabelClick = (label) => {
        // If you need any action when clicking a card label
    };
    
    const handleRemoveCardLabel = (labelId, event) => {
        event.stopPropagation();
        setCardLabels(prevLabels => prevLabels.filter(label => label.id !== labelId));
    };

    return (
        <div className="label-popup-overlay" onClick={onClose}>
            <div className="new-label-popup" onClick={e => e.stopPropagation()} ref={labelPopupRef}>
                <div className="content-frame">
                    <div className="text-container">
                        <div className="addlabel-main-text">Add labels to card</div>
                        <div className="supporting-text">Labels help organize your cards.</div>
                    </div>
                    <div className="labels-input-area">
                        <div className="input-area">
                            <div className="input-label">Label</div>
                            <div className="selection-frame">
                                <div className="label-dynamic-input-frame">
                                    <input 
                                        ref={inputRef}
                                        className="newlabel-input-container" 
                                        placeholder="Enter label name"
                                        value={labelInput}
                                        onChange={(e) => setLabelInput(e.target.value)}
                                    />
                                    <div className="color-input-field" ref={colorInputRef} onClick={(e) => { e.stopPropagation(); setIsColorDropdownOpen(prev => !prev);}}>
                                        <div className="color-field-content">
                                            <div className="color-circle" id="selectedColor" style={{backgroundColor: selectedColor}}></div>
                                            <ArrowDownIcon className='vuesaxlineararrow-down-icon'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-label-button-frame" onClick={handleAddLabel}>
                                    <PlusIcon className='plus-icon-container'/>
                                </div>
                            </div>
                            <div className="available-labels-area">
                            {availableLabels.map(label => {
                                const defaultColor = '#cccccc';
                                const color = label.color || defaultColor;
                                const rgb = hexToRgb(color);
                                const style = rgb ? {
                                    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                                    color: color
                                } : {
                                    backgroundColor: 'rgba(204, 204, 204, 0.2)',
                                    color: defaultColor
                                };

                                return (
                                    <div key={label.id} className="card-label" style={style} onClick={() => handleAvailableLabelClick(label)}>
                                        <div className="card-label-text">{label.name}</div>
                                        <div className="remove-icon-wrapper" onClick={(e) => handleDeleteAvailableLabel(label.id, e)}>
                                            <RemoveIcon className="remove-label-icon" stroke={color}/>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>
                    <div className="input-area">
                        <div className="labels-input-area">
                            <div className="input-label">Card labels</div>
                        </div>
                        <div className="card-labels-area">
                        {cardLabels.map(label => {
                            const defaultColor = '#cccccc';
                            const color = label.color || defaultColor;
                            const rgb = hexToRgb(color);
                            const style = rgb ? {
                                backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
                                color: color
                            } : {
                                backgroundColor: 'rgba(204, 204, 204, 0.2)',
                                color: defaultColor
                            };

                            return (
                                <div key={label.id} className="card-label" style={style} onClick={() => handleCardLabelClick(label)}>
                                    <div className="card-label-text">{label.name}</div>
                                    <div className="remove-icon-wrapper" onClick={(e) => handleRemoveCardLabel(label.id, e)}>
                                        <RemoveIcon className="remove-label-icon" stroke={color}/>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                    <div className="add-labels-actions-section">
                        <div className="action-buttons-area">
                            <div className="cancel-button-area" onClick={onClose}>
                                <div className="cancel-button-base">
                                    <div className="cancel-button-text">Cancel</div>
                                </div>
                            </div>
                            <div className="add-labels-button-area" onClick={handleAddLabels}>
                                <div className="add-labels-button-base">
                                    <div className="add-labels-button">Add labels</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isColorDropdownOpen && (
                    <div className="colors-dropdown" id="colorsDropdown" ref={colorDropdownRef}>
                        <div className="colors-container">
                            {['#91cd56', '#34d1b2', '#01b0fd', '#8568f4', '#ae52d3', '#ec4ea5', '#fb8120', '#fac624', '#a9a9a9', '#a74c3c', '#07bc0c', '#2043fb'].map(color => (
                                <div 
                                    key={color} 
                                    className="color-option" 
                                    style={{backgroundColor: color}}
                                    onClick={() => handleColorSelect(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export default LabelPopup;