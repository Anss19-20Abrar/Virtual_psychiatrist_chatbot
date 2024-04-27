import React from 'react';
import { Link } from 'react-router-dom';

const Intro = () => {
  return (
    <div className="intro-container">
      <img src="background.jpg" alt="Mental health background" className="intro-background" />
      <div className="intro-content">
        <img src="logo.png" alt="Virtual Psychiatrist Logo" className="logo" />
        <h1 className="intro-title">Welcome to Virtual Psychiatrist</h1>
        <p className="intro-text">Your mental well-being is our priority. Begin your journey to a healthier mind today.</p>
        <div className="button-container">
          <Link to="/signin" className="sign-in-button">Sign In</Link>
          <Link to="/signup" className="sign-up-button">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
