import React, { useState, useEffect } from 'react';
import axios from '../axios-config.js';
import '../styles/Navbar.css';
import logo from '../assets/white_logo.png';
import searchIcon from '../assets/search.svg';
import notificationIcon from '../assets/notification.svg';


const Navbar = () => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, []);
  
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
              {user && user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User avatar'} 
                  className="user-avatar-image"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Navbar;