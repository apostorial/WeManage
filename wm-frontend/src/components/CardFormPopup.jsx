import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios-config.js';
import '../styles/CardFormPopup.css';
import CardIcon from '../assets/card_icon.svg?react';
import CloseIcon from '../assets/close_icon.svg?react';
import UserIcon from '../assets/user.svg?react';
import ContentDivider from '../assets/content_divider.svg?react';
import DividerHeader from '../assets/new_card_popup_divider_header.svg?react';
import DividerFooter from '../assets/new_card_popup_divider_footer.svg?react';
import BuildingIcon from '../assets/building.svg?react';
import BriefcaseIcon from '../assets/briefcase.svg?react';
import SmsIcon from '../assets/sms.svg?react';
import CallIcon from '../assets/call.svg?react';
import GlobalIcon from '../assets/global.svg?react';
import Calendar2Icon from '../assets/calendar_2.svg?react';
import PlusLabelIcon from '../assets/plus_label.svg?react';
import UploadIcon from '../assets/file_upload_icon.svg?react';
import DatePicker from 'react-datepicker';
import { format, parseISO, addHours, subHours } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/custom-datepicker.css';

const CardFormPopup = ({ onClose, onSubmit, columnId, editCard = null }) => {
    const [cardName, setCardName] = useState('');
    const [cardCompany, setCardCompany] = useState('');
    const [cardPosition, setCardPosition] = useState('');
    const [cardEmail, setCardEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardWebsite, setCardWebsite] = useState('');
    const [cardMeetingDate, setCardMeetingDate] = useState(null);
    const [labelIds, setLabelIds] = useState([]);
    const [error, setError] = useState(null);
    const isEditMode = !!editCard;
    const popupRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setCardName(editCard.name || '');
            setCardCompany(editCard.company || '');
            setCardPosition(editCard.position || '');
            setCardEmail(editCard.email || '');
            setCardNumber(editCard.number || '');
            setCardWebsite(editCard.website || '');
            if (editCard.meeting) {
                const meetingDate = parseISO(editCard.meeting);
                setCardMeetingDate(subHours(meetingDate, 1));
            } else {
                setCardMeetingDate(null);
            }
        }
    }, [editCard]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (cardName.trim()) {
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append('columnId', columnId);
                params.append('name', cardName.trim());
                params.append('company', cardCompany.trim());
                params.append('position', cardPosition.trim());
                params.append('email', cardEmail.trim());
                params.append('number', cardNumber.trim());
                params.append('website', cardWebsite.trim());
                if (cardMeetingDate) {
                    params.append('meeting', format(addHours(cardMeetingDate, 1), "yyyy-MM-dd'T'HH:mm:ssXXX"));
                }
                labelIds.forEach(id => params.append('labelIds', id));

                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                let response;
                if (isEditMode) {
                    response = await axios.put(`/api/cards/update/${editCard.id}`, params, config);
                } else {
                    response = await axios.post('/api/cards/create', params, config);
                }

                onSubmit(response.data.card);
                onClose();
            } catch (err) {
                setError(`Failed to ${isEditMode ? 'update' : 'create'} card. Please try again.`);
                console.error(`Error ${isEditMode ? 'updating' : 'creating'} card:`, err);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                handleSubmit();
            }
        };
    
        const currentPopup = popupRef.current;
        if (currentPopup) {
            currentPopup.addEventListener('keydown', handleKeyDown);
        }
    
        return () => {
            if (currentPopup) {
                currentPopup.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [handleSubmit]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="overlay" id="newListOverlay" ref={popupRef} tabIndex='0'>
        <div className='new-card-popup'>
            <div className="new-card-popup-header">
                <div className="new-card-popup-content">
                    <div className="card-icon">
                        <CardIcon className="card-icon1" />
                    </div>
                    <div className="text-and-supporting-text">
                        <div className="text">{isEditMode ? 'Edit your card' : 'Add a new card'}</div>
                        <div className="supporting-text">{isEditMode ? 'Fill in the fields below to update your card.' : 'Fill in the fields below to add a card.'}</div>
                    </div>
                </div>
                <DividerHeader className="new-card-popup-divider-header" />
                <div className="x-icon">
                    <div className="x" onClick={onClose}>
                        <CloseIcon className="icon" />
                    </div>
                </div>
            </div>
            <div className="new-card-popup-form">
                <div className="form">
                    <div className="fullname-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Full name</div>
                                <div className="newcards-input-container">
                                    <input
                                        ref={inputRef}
                                        className="input" 
                                        placeholder="Full name" 
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                    />
                                    <UserIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="company-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Company</div>
                                <div className="newcards-input-container">
                                    <input 
                                        className="input" 
                                        placeholder="Company" 
                                        value={cardCompany}
                                        onChange={(e) => setCardCompany(e.target.value)}
                                    />
                                    <BuildingIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="company-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Position</div>
                                <div className="newcards-input-container">
                                    <input 
                                        className="input" 
                                        placeholder="Position" 
                                        value={cardPosition}
                                        onChange={(e) => setCardPosition(e.target.value)}
                                    />
                                    <BriefcaseIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="company-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Email address</div>
                                <div className="newcards-input-container">
                                    <input 
                                        className="input" 
                                        placeholder="Email address" 
                                        value={cardEmail}
                                        onChange={(e) => setCardEmail(e.target.value)}
                                    />
                                    <SmsIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="company-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Phone number</div>
                                <div className="newcards-input-container">
                                    <input 
                                        className="input" 
                                        placeholder="Phone number" 
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                    <CallIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="website-input-field">
                        <div className="fullname-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Website</div>
                                <div className="newcards-input-container">
                                    <input 
                                        className="input" 
                                        placeholder="Website" 
                                        value={cardWebsite}
                                        onChange={(e) => setCardWebsite(e.target.value)}
                                    />
                                    <GlobalIcon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="website-input-field">
                        <div className="company-input-field">
                            <div className="card-popup-input-with-label">
                                <div className="card-popup-label">Meeting date</div>
                                <div className="newcards-input-container">
                                <DatePicker
                                    selected={cardMeetingDate ? addHours(cardMeetingDate, 1) : null}
                                    onChange={(date) => setCardMeetingDate(date ? subHours(date, 1) : null)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    placeholderText="Select date and time"
                                    showPopperArrow={false}
                                    customInput={
                                        <input
                                            className='input-datepicker'
                                            value={cardMeetingDate ? format(addHours(cardMeetingDate, 1), "yyyy-MM-dd'T'HH:mm:ssXXX") : ''}
                                            readOnly
                                        />
                                    }
                                />
                                    <Calendar2Icon className="vuesaxlinearuser-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ContentDivider className="content-divider-icon" />
                <div className="labels-and-attachments">
                    <div className="add-labels">
                        <div className="fullname-input-field">
                            <div className="text8">Labels</div>
                            <div className="supporting-text1">Labels help organize your cards.</div>
                        </div>
                        <div className="card-popup-labels-container">
                        <div className="card-popup-add-label-button">
                            <PlusLabelIcon className="plus-icon" />
                            </div>
                        </div>
                    </div>
                    <div className="add-labels">
                        <div className="fullname-input-field">
                            <div className="text8">Attachments</div>
                            <div className="supporting-text2">Add related attachments to the card here.</div>
                        </div>
                        <div className="file-upload">
                            <div className="file-upload-base">
                                <div className="content7">
                                    <UploadIcon className="file-upload-icon" />
                                    <div className="text-and-supporting-text3">
                                        <div className="action">
                                            <div className="upload-button">
                                                <div className="upload-button-base">
                                                    <div className="click-to-upload">Click to upload</div>
                                                </div>
                                            </div>
                                            <div className="text11">or drag and drop</div>
                                        </div>
                                        <div className="supporting-text3">PDF, DOC, XLS, PNG or ZIP</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="new-card-popup-footer">
                <div className="new-card-popup-actions">
                    <div className="new-card-popup-buttons">
                        <div className="new-card-popup-cancel-button">
                            <div className="button-base" onClick={onClose}>
                                <div className="text12">Cancel</div>
                            </div>
                        </div>
                        <div className="new-card-popup-add-card-button">
                            <div className="button-base1" onClick={handleSubmit}>
                                <div className="card-popup-label">{isEditMode ? 'Update card' : 'Add card'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="new-card-popup-divider-footer">
                    <DividerFooter className="new-card-popup-divider-footer1" />
                </div>
            </div>
        </div>
    </div>
    );
  };

export default CardFormPopup;