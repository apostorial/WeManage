import React from 'react';
import '../index.css';
import '../styles/Login.css';
import logo from '../assets/white_logo.png';
import background from '../assets/background.svg';

const Login = () => {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="desktop-5">
      <div className="main-form-parent">
        <div className="main-form">
          <div className="tittle">
            <div className="h1">Welcome!</div>
            <div className="h2">Please sign in with Google to continue.</div>
          </div>
          <button onClick={handleGoogleLogin} className="google-button">
            <div className="login-label">Sign in with Google</div>
          </button>
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