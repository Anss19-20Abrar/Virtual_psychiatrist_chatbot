// ContactUs.jsx
import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../firebase'; // Adjust the path to your actual firebase.js file

const ContactUs = ({ toggleContactUs }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase(app); // Use the imported app variable here
    const newContactRef = push(ref(db, 'contacts'));
    await set(newContactRef, { fullName, email, message });

    // Reset form fields
    setFullName('');
    setEmail('');
    setMessage('');

    // Close the contact form
    toggleContactUs();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto'>
        <div className='text-center w-full bg-gray-800 text-gray-100 px-8 py-12 rounded-t-lg'>
          <h1 className='text-4xl lg:text-6xl'>Contact Form</h1>
        </div>
        <div className='px-8 py-16 grid gap-8 grid-cols-1 md:grid-cols-2 bg-gray-100 text-gray-900 rounded-b-lg shadow-lg'>
          <div className='flex flex-col justify-between'>
            <div>
              <h2 className='text-4xl lg:text-5xl font-bold leading-tight'>Let's talk about everything!</h2>
              <div className='text-gray-700 mt-8'>
                Hate forms? Send us an <span className='underline'>email</span> instead.
              </div>
            </div>
          </div>
          <div>
            <form id="contactForm" onSubmit={handleSubmit}>
              <div>
                <span className='uppercase text-sm text-gray-600 font-bold'>Full Name</span>
                <input
                  id='fullName'
                  className='w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline'
                  type='text'
                  placeholder='John Doe'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className='mt-8'>
                <span className='uppercase text-sm text-gray-600 font-bold'>Email</span>
                <input
                  id='email'
                  className='w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline'
                  type='email'
                  placeholder='example@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='mt-8'>
                <span className='uppercase text-sm text-gray-600 font-bold'>Message</span>
                <textarea
                  id='message'
                  className='w-full h-32 bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline'
                  placeholder='Your message here...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className='mt-8'>
                <button
                  type='submit'
                  className='uppercase text-sm font-bold tracking-wide bg-indigo-500 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline'
                >
                  Send Message
                </button>
              </div>
            </form>
            <button
              className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700'
              onClick={toggleContactUs}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactUs;
