import React, { useState } from 'react';
import '../index.css';
import '../styles/Login.css';
import axios from '../axios-config.js';
import { useNavigate } from 'react-router-dom';
import eyeIcon from '../assets/eye icon.svg';
import showPassIcon from '../assets/show pass icon.svg';
import logo from '../assets/Wemanity white logo.png';
import background from '../assets/background we 2.svg';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:8080/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        setErrorMessage('');
        navigate('/sidebar');
      } else {
        setErrorMessage('Incorrect credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error during login. Please try again.');
    }
  };

  return (
    <div className="desktop-5">
      <div className="main-form-parent">
        <div className="main-form">
          <div className="tittle">
            <div className="h1">Welcome back!</div>
            <div className="h2">Please enter your username and password.</div>
          </div>
          <form onSubmit={handleSubmit} className="form-input-fields">
            <div className="username-field">
              <div className="username-field-tittle">Username</div>
              <div className="username-input-field">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="username-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="vuesax/linear/user">
                      <g id="user">
                        <path
                          id="Vector"
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="#DCDCDC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          id="Vector_2"
                          d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22"
                          stroke="#DCDCDC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                  type={passwordVisible ? "text" : "password"}
                  className="input-field"
                  placeholder="Enter your password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="password-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="vuesax/linear/lock">
                      <g id="lock">
                        <path
                          id="Vector"
                          d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                          stroke="#DCDCDC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          id="Vector_2"
                          d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                          stroke="#DCDCDC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          id="Vector_3"
                          d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                          stroke="#DCDCDC"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
                <img
                  className="eye-icon"
                  id="eyeicon"
                  src={passwordVisible ? showPassIcon : eyeIcon}
                  alt="Toggle visibility"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="button">
              <div className="label">Log in</div>
            </button>
          </form>
          <a href="#" className="reset">
            Forgot your password? Contact an admin
          </a>
        </div>
        <div className="card">
          <img className="background-we-2" alt="" src={background} />
          <div className="card-text">
            <img
              className="wemanity-white-logo"
              alt=""
              src={logo}
            />
            <div className="card-tittles">
              <div className="heading-1">Making Change Your Second Nature</div>
              <div className="heading-2">
                Wemanity is an innovation ecosystem designed to help
                organisations drive their transformation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
