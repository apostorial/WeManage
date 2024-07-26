import React from 'react';
import '../styles/Navbar.css';
import logo from '../assets/white_logo.png';
import searchIcon from '../assets/search.svg';
import notificationIcon from '../assets/notification.svg';

const Navbar = () => {
  return (
    <div className='nav-bar'>
        <div className='navbar-context'>
            <img className='logo-icon' src={logo} alt='Wemanity Logo' />
            <div className='context-right'>
                <div className='navbar-search'>
                    <img src={searchIcon} alt="Search Icon" className="search-icon" />
                    <input type="text" placeholder="Search" className='search-input' />
                </div>
                <div className='notification'>
                    <img src={notificationIcon} alt="Notifications Icon" className="notification-icon" />
                </div>
                <div className='user-avatar'>

                </div>
            </div>
        </div>
    </div>
  );
};

export default Navbar;