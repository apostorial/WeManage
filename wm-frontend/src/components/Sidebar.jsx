import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import homeIcon from '../assets/home.svg'
import boardIcon from '../assets/board.svg'
import arrowIcon from '../assets/arrow.svg'
import boardItemIcon from '../assets/board_item.svg'
import boardAddIcon from '../assets/board_add.svg'
import reportIcon from '../assets/report.svg'
import statisticIcon from '../assets/statistic.svg'
import calendarIcon from '../assets/calendar.svg'
import membersIcon from '../assets/members.svg'
import tasksIcon from '../assets/tasks.svg'
import inboxIcon from '../assets/inbox.svg'
import documentationIcon from '../assets/documentation.svg'
import settingsIcon from '../assets/settings.svg'
import logoutIcon from '../assets/logout.svg'

const Sidebar = ({ boards, onBoardSelect, onAddBoard, onDeleteBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const [isBoardsExpanded, setIsBoardsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleAddBoard = (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    onAddBoard(newBoardName);
    setNewBoardName('');
  };

  const toggleBoardsExpanded = () => {
    setIsBoardsExpanded(!isBoardsExpanded);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddBoard(e);
    }
  };

  return (
    <div className="side-bar">
      <div className="sidebar-content">
        <div className="main-menu">
        <div className="main-text">Main</div>
        <div className="sidebar-list">
          <a href="" className="sidebar-item">
            <img src={homeIcon} alt="Board Icon" className="sidebar-icon" />
            <span>Home</span>
          </a>
          <div className={`sidebar-item boards ${isBoardsExpanded ? 'active' : ''}`}>
            <div className="boards-header" onClick={toggleBoardsExpanded}>
              <img src={boardIcon} alt="Board Icon" className="sidebar-icon" />
              <span>Boards</span>
              <img src={arrowIcon} alt="Arrow Icon" className="arrow-icon" />
            </div>
            <div className="boards-content">
              {Array.isArray(boards) && boards.length > 0 && (
                boards.map((board) => (
                  <a key={board.id} href="" className="board-option" onClick={(e) => {
                    e.preventDefault();
                    onBoardSelect(board);
                    }}>
                    <img src={boardItemIcon} alt="Board Item Icon" className="sidebar-icon" />
                    <span>{board.name}</span>
                  </a>
                ))
              )}
              <a href="" className="board-option add-new" onClick={handleAddBoard}>
                  <img src={boardAddIcon} alt="Board Add Icon" className="sidebar-icon" />
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Add a new board"
                    onKeyDown={handleKeyDown}
                  />
                </a>
              </div>
            </div>
            <a href="" class="sidebar-item">
              <img src={calendarIcon} alt="Calendar Icon" className="sidebar-icon" />
              <span>Calendar</span>
            </a>
            <a href="" class="sidebar-item">
              <img src={reportIcon} alt="Report Icon" className="sidebar-icon" />
              <span>Reports</span>
            </a>
            <a href="" class="sidebar-item">
              <img src={statisticIcon} alt="Statistic Icon" className="sidebar-icon" />
              <span>Statistics</span>
            </a>
          </div>
        </div>
      </div>
      <div class="team-section">
				<div class="main-text">Team</div>
				<div class="sidebar-list">
					<a href="" class="sidebar-item">
            <img src={membersIcon} alt="Members Icon" className="sidebar-icon" />						
						<span>Members</span>
					</a>
					<a href="" class="sidebar-item">
            <img src={tasksIcon} alt="Tasks Icon" className="sidebar-icon" />
						<span>Tasks</span>
					</a>
					<a href="" class="sidebar-item">
            <img src={inboxIcon} alt="Inbox Icon" className="sidebar-icon" />
						<span>Inbox</span>
					</a>
				</div>
			</div>
      <div class="info-section">
        <div class="main-text">Information</div>
        <div class="sidebar-list">
          <a href="" class="sidebar-item">
          <img src={documentationIcon} alt="Inbox Icon" className="sidebar-icon" />
            <span>Documentation</span>
          </a>
          <a href="" class="sidebar-item">
            <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
            <span>Settings</span>
          </a>
          <a href="" class="sidebar-item-logout" onClick={handleLogout}>
          <svg className='sidebar-icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.41699 6.29998C7.67533 3.29998 9.21699 2.07498 12.592 2.07498H12.7003C16.4253 2.07498 17.917 3.56665 17.917 7.29165V12.725C17.917 16.45 16.4253 17.9416 12.7003 17.9416H12.592C9.24199 17.9416 7.70033 16.7333 7.42533 13.7833" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.4999 10H3.0166" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.87467 7.20834L2.08301 10L4.87467 12.7917" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>		
            <span>Logout</span>
          </a>
        </div>
        </div>
    </div>
  );
};

export default Sidebar;