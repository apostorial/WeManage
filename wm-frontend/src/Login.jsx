import React, { useState } from 'react';
import './index.css';
import './Login.css';
import logo from './assets/Logo.png';
import eyeIcon from './assets/eye icon.svg';
import showPassIcon from './assets/show pass icon.svg';

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        // Handle successful login
        const data = await response;
        console.log('Login successful:', data);
      } else {
        window.location.href = 'https://www.google.com';
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="body">
      <div className="main">
        <div className="content">
          <div className="form-container">
            <div className="logo-tittle">
              <img className="logo-icon" alt="" src={logo} />
              <div className="title-subtitle">
                <div className="title">Sign in to your account</div>
                <div className="subtitle">Please enter your details</div>
              </div>
            </div>
            <form className="form-input-fields" onSubmit={handleSubmit}>
              <div className="username-field">
                <div className="username-field-tittle">Username</div>
                <div className="username-input-field">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="username-icon" alt="">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="vuesax/linear/user">
                  <g id="user">
                  <path id="Vector" d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#DCDCDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path id="Vector_2" d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="#DCDCDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  </g>
                  </svg>

                  </div>
                </div>
              </div>
              <div className="username-field">
                <div className="username-field-tittle">Password</div>
                <div className="password-input-field">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <img
                    className="eye-icon"
                    id="eyeicon"
                    src={passwordVisible ? showPassIcon : eyeIcon}
                    onClick={togglePasswordVisibility}
                    alt=""
                  />
                  <div className="password-icon" alt="">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="vuesax/linear/lock">
                  <g id="lock">
                  <path id="Vector" d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="#DCDCDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path id="Vector_2" d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke="#DCDCDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path id="Vector_3" d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#DCDCDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  </g>
                  </svg>

                  </div>
                </div>
              </div>
              <div className="frame-parent">
                <button type="submit" className="sign-in-parent">
                  <div className="sign-in">Sign in</div>
                </button>
                <div className="forgot-your-password-parent">
                  <div className="forgot-your-password">Forgot your password?</div>
                  <a href="#" className="reset-password">Reset password</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
