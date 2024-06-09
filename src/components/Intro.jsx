import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const Intro = () => {
  return (
    <div className="relative h-screen text-white">
      {/* Background Image */}
      <img src="background.jpg" alt="Mental health background" className="intro-background" />

      {/* Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center p-5 bg-opacity-70 bg-black z-10">
        <div className="flex items-center">
          <img src="logo.png" alt="Virtual Psychiatrist Logo" className="w-10 mr-3" />
          <span className="text-2xl font-bold">Virtual Psychiatrist</span>
        </div>
        <ul className="flex space-x-5">
          <li><Link to="/" className="hover:text-yellow-500">Home</Link></li>
          <li><Link to="/signup" className="hover:text-yellow-500">Signup</Link></li>
          <li><Link to="/signin" className="hover:text-yellow-500">Login</Link></li>
          <li><Link to="/about" className="hover:text-yellow-500">About-Us</Link></li>
          <li><Link to="/contactUs" className="hover:text-yellow-500">Contact-Us</Link></li>
        </ul>
      </nav>

      {/* Content */}
      <div className="relative flex flex-col justify-center items-start h-full p-10">
        <div className="max-w-md bg-opacity-70 bg-black p-8 rounded-lg z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to Chatbot for Mental Health</h1>
          <p className="text-2xl mb-8">Your mental well-being is our priority. Begin your journey to a healthier mind today.</p>
          <Link to="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded transition duration-300">Let's Start</Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
