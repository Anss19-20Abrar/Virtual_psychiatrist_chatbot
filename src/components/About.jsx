import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const About = () => {
  return (
    <div className="relative h-screen text-white">
      {/* Background Image */}
      <img src="background.jpg" alt="Mental health background" className="absolute w-full h-full object-cover filter blur-md" />

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center h-full p-10">
        <div className="max-w-3xl bg-opacity-70 bg-black p-8 rounded-lg z-10 text-left">
          <img src="logo.png" alt="CalmBot Logo" className="w-20 mx-auto mb-5" />
          <h1 className="text-4xl font-bold mb-4 text-center">About CalmBot</h1>
          <p className="text-lg mb-4">
            Welcome to CalmBot, your virtual companion for relaxation and stress relief. CalmBot is designed to help you unwind,
            destress, and find peace in your busy life.
          </p>
          <p className="text-lg mb-4">
            CalmBot offers a range of features and tools to promote relaxation, mindfulness, and mental well-being:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Speech Recognition:</strong> Enables voice-based interaction for seamless communication with users.
            </li>
            <li>
              <strong>Personalized Relaxation Techniques:</strong> Offers tailored mindfulness exercises and stress relief activities based on individual needs.
            </li>
            <li>
              <strong>Human-like Responses:</strong> Integrates AI to provide empathetic and human-like responses to users' queries and emotions.
            </li>
            <li>
              <strong>User Profile Management:</strong> Allows users to create and customize profiles, tailoring the experience to their preferences.
            </li>
            <li>
              <strong>Interaction History:</strong> Keeps track of past conversations and interactions, providing continuity and personalized recommendations.
            </li>
          </ul>
          <p className="text-lg mb-4">
            Using CalmBot is simple. Just select your desired feature from the menu, follow the instructions, and let CalmBot guide you on a journey to tranquility.
          </p>
          <p className="text-lg mb-4">
            Take some time for yourself, breathe deeply, and discover the peace within with CalmBot.
          </p>
          <p className="text-lg">
            For any inquiries or feedback, please contact us at <a href="mailto:anssabrar11@gmail.com" className="text-yellow-500 hover:text-yellow-600">calmbot@example.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

